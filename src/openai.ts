import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources";
import { z } from 'zod';
import { produtosEmEstoque, produtosEmFalta, setarEmbedding, todosProdutos } from "./database";
import OpenAI from 'openai';

const schema = z.object({
  produtos: z.array(z.string()),
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateProducts = async (message: string) => {
  const prompt = `Analise a seguinte descrição e retorne uma lista de produtos relevantes em formato JSON com a chave "produtos" contendo um array de strings.
  
Descrição: ${message}

Retorne APENAS o JSON no formato:
{
  "produtos": ["produto1", "produto2", ...]
}`;

  const completion = await client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });

  try {
    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return schema.parse(response);
  } catch (error) {
    console.error('Error parsing response:', error);
    return { produtos: [] };
  }
};

export const generateEmbedding = async (input: string) => {
  try {
    const response = await client.embeddings.create({
      input,
      model: 'text-embedding-3-small',
      encoding_format:  'float',
    });

    return response.data[0].embedding ?? null;
  } catch (error) {
    return null;
  }
}

export const embedProducts = async () => {
  const produtos = todosProdutos();

  await Promise.allSettled(produtos.map(async (p, index) => {
    const embedding = await generateEmbedding(`${p.nome}: ${p.descricao}`);
    if (!embedding) return;
    setarEmbedding(index, embedding);
  }))
}