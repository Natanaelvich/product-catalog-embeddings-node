import { zodResponseFormat, zodTextFormat } from 'openai/helpers/zod';
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources';
import { z } from 'zod';
import {
  produtosEmEstoque,
  produtosEmFalta,
  setarEmbedding,
  todosProdutos,
} from './database';
import OpenAI from 'openai';
import { ResponseCreateParamsNonStreaming } from 'openai/resources/responses/responses';
import { ReadStream } from 'fs';

// Schema que define a estrutura da resposta esperada do modelo
// Usado com zodResponseFormat para garantir que o modelo retorne dados no formato correto
const schema = z.object({
  produtos: z
    .array(z.string())
    .describe('Lista de produtos relevantes para a descrição fornecida'),
});

type ProdutosResponse = z.infer<typeof schema>;

// Inicializa o cliente OpenAI com a chave da API
// Este cliente é usado para fazer chamadas à API da OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define as ferramentas (tools) que o modelo pode usar durante a conversa
// Cada ferramenta é uma função que o modelo pode chamar para obter informações adicionais
const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'produtos_em_estoque',
      description: 'Lista os produtos que estão em estoque.',
      parameters: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: 'function',
    function: {
      name: 'produtos_em_falta',
      description: 'Lista os produtos que estão em falta.',
      parameters: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      strict: true,
    },
  },
];

/**
 * Função recursiva que gerencia a conversa com o modelo, incluindo chamadas de ferramentas
 * @param messages - Array de mensagens da conversa (system, user, assistant, tool)
 * @param format - Formato de resposta esperado (usando zodResponseFormat)
 * @returns A resposta final do modelo após todas as chamadas de ferramentas
 */
const generateCompletion = async (
  messages: ChatCompletionMessageParam[],
  format: any
): Promise<any> => {
  // Faz a chamada à API da OpenAI com as ferramentas disponíveis
  const completion = await client.beta.chat.completions.parse({
    model: 'gpt-4-turbo-preview',
    max_tokens: 100,
    response_format: format,
    tools,
    messages,
  });

  // Verifica se o modelo recusou a solicitação
  if (completion.choices[0].message.refusal) {
    throw new Error('Refusal');
  }

  // Verifica se o modelo quer chamar alguma ferramenta
  const { tool_calls } = completion.choices[0].message;
  if (tool_calls) {
    const [tool_call] = tool_calls;
    // Mapeia os nomes das ferramentas para suas funções correspondentes
    const toolsMap: Record<string, Function> = {
      produtos_em_estoque: produtosEmEstoque,
      produtos_em_falta: produtosEmFalta,
    };
    const functionToCall = toolsMap[tool_call.function.name];
    if (!functionToCall) {
      throw new Error('Function not found');
    }
    // Executa a função da ferramenta com os argumentos fornecidos pelo modelo
    const result = functionToCall(tool_call.function.parsed_arguments);

    // Adiciona a mensagem do modelo e o resultado da ferramenta ao histórico da conversa
    // Isso permite que o modelo use o resultado em sua próxima resposta
    messages.push(completion.choices[0].message);
    messages.push({
      role: 'tool',
      tool_call_id: tool_call.id,
      content: result.toString(),
    });

    // Faz uma nova chamada ao modelo com o histórico atualizado
    // Isso permite que o modelo use as informações obtidas da ferramenta
    const completionWithToolResult = await generateCompletion(
      messages,
      zodResponseFormat(schema, 'produtos_schema')
    );
    return completionWithToolResult;
  }

  return completion;
};

/**
 * Função principal que gera recomendações de produtos
 * @param message - Descrição ou necessidade do usuário
 * @returns Lista de produtos recomendados
 */
export const generateProducts = async (
  message: string
): Promise<ProdutosResponse> => {
  // Inicializa a conversa com uma mensagem do sistema e a mensagem do usuário
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'Liste no máximo três produtos que atendam a necessidade do usuário. Considere apenas os produtos em estoque.',
    },
    {
      role: 'user',
      content: message,
    },
  ];

  // Usa zodResponseFormat para garantir que a resposta siga o schema definido
  // O segundo parâmetro ('produtos_schema') é um identificador para o schema
  const completion = await generateCompletion(
    messages,
    zodResponseFormat(schema, 'produtos_schema')
  );
  return (completion.choices[0].message as any).parsed as ProdutosResponse;
};

export const generateEmbedding = async (input: string) => {
  try {
    const response = await client.embeddings.create({
      input,
      model: 'text-embedding-3-small',
      encoding_format: 'float',
    });

    return response.data[0].embedding ?? null;
  } catch (error) {
    return null;
  }
};

export const embedProducts = async () => {
  const produtos = todosProdutos();

  await Promise.allSettled(
    produtos.map(async (p, index) => {
      const embedding = await generateEmbedding(`${p.nome}: ${p.descricao}`);
      if (!embedding) return;
      setarEmbedding(index, embedding);
    })
  );
};

const generateResponse = async <T = null>(
  params: ResponseCreateParamsNonStreaming
) => {
  const response = await client.responses.parse(params);
  if (response.output_parsed) return response.output_parsed as T;

  return null;
};

const createCartPromptChunks = (input: string, products: string[]) => {
  const chunkSize = 10;
  const chunks: string[] = [];

  for (let i = 0; i < chunkSize; i += chunkSize) {
    chunks.push(
      `Retorne uma lista de até 5 produtos que satisfação a necessidade do usuário. Os produtos disponíveis são os seguintes: ${JSON.stringify(
        products.slice(i, i + chunkSize)
      )}`
    );
  }

  return chunks;
};

export const generateCart = async (input: string, products: string[]) => {
  const promises = createCartPromptChunks(input, products).map((chunk) => {
    return generateResponse<{
      produtos: string[];
    }>({
      model: 'gpt-4o-mini',
      instructions: chunk,
      input,
      text: {
        format: zodTextFormat(schema, 'carrinho'),
      },
    });
  });

  const results = await Promise.all(promises);

  return results
    .filter((r): r is { produtos: string[] } => Boolean(r))
    .flatMap((r) => r.produtos);
};

export const uploadFile = async (file: ReadStream) => {
  const uploaded = await client.files.create({
    file,
    purpose: 'assistants',
  });

  console.dir(uploaded, { depth: null });
};

export const createVector = async () => {
  const vectorStore = await client.vectorStores.create({
    name: 'node_ia_file_search_class',
    file_ids: ['file-1dfG23PHQFKsh8PXHhj5sK'],
  });

  console.dir(vectorStore, { depth: null });
};
