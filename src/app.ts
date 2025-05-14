import 'dotenv/config';
import express from 'express';
import { embedProducts, generateEmbedding, generateProducts } from "./openai";
import { todosProdutos } from "./database";

const app = express();
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { input } = req.body;
  await generateProducts(input);
  res.status(201).end();
});

app.post('/embeddings', async (req, res) => {
  await embedProducts();
  console.log(todosProdutos());
  res.status(201).end();
});

app.post('/embedding', async (req, res) => {
  const { input } = req.body;
  await generateEmbedding(input);
  res.status(201).end();
});

export default app;