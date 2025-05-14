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
  const completion = await client.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "gpt-3.5-turbo",
    response_format: zodResponseFormat(schema),
  });

  return completion.choices[0].message.parsed;
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