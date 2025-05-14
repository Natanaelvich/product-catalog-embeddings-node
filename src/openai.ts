import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources";
import { z } from 'zod';
import { produtosEmEstoque, produtosEmFalta, setarEmbedding, todosProdutos } from "./database";
import OpenAI from 'openai';

const schema = z.object({
  produtos: z.array(z.string()).describe('Lista de produtos relevantes para a descrição fornecida'),
});

type ProdutosResponse = z.infer<typeof schema>;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

const generateCompletion = async (messages: ChatCompletionMessageParam[], format: any): Promise<any> => {
  const completion = await client.beta.chat.completions.parse({
    model: 'gpt-4-turbo-preview',
    max_tokens: 100,
    response_format: format,
    tools,
    messages,
  });

  if (completion.choices[0].message.refusal) {
    throw new Error('Refusal');
  }

  const { tool_calls } = completion.choices[0].message;
  if (tool_calls) {
    const [tool_call] = tool_calls;
    const toolsMap: Record<string, Function> = {
      produtos_em_estoque: produtosEmEstoque,
      produtos_em_falta: produtosEmFalta,
    };
    const functionToCall = toolsMap[tool_call.function.name];
    if (!functionToCall) {
      throw new Error('Function not found');
    }
    const result = functionToCall(tool_call.function.parsed_arguments);
    messages.push(completion.choices[0].message);
    messages.push({
      role: 'tool',
      tool_call_id: tool_call.id,
      content: result.toString(),
    });
    const completionWithToolResult = await generateCompletion(messages, zodResponseFormat(schema, 'produtos_schema'));
    return completionWithToolResult;
  }

  return completion;
};

export const generateProducts = async (message: string): Promise<ProdutosResponse> => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: 'Liste no máximo três produtos que atendam a necessidade do usuário. Considere apenas os produtos em estoque.',
    },
    {
      role: 'user',
      content: message,
    },
  ];

  const completion = await generateCompletion(messages, zodResponseFormat(schema, 'produtos_schema'));
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

  await Promise.allSettled(produtos.map(async (p, index) => {
    const embedding = await generateEmbedding(`${p.nome}: ${p.descricao}`);
    if (!embedding) return;
    setarEmbedding(index, embedding);
  }));
};