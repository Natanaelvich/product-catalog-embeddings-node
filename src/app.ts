import 'dotenv/config';
import express from 'express';
import { embedProducts, generateEmbedding, generateProducts } from "./openai";
import { produtosEmEstoque, produtosEmFalta, todosProdutos } from "./database";

const app = express();
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { input } = req.body;
  const result = await generateProducts(input);
  res.status(201).json(result);
});

app.post('/embeddings', async (req, res) => {
  await embedProducts();
  res.status(201).end();
});

app.post('/embedding', async (req, res) => {
  const { input } = req.body;
  const embedding = await generateEmbedding(input);
  res.status(201).json(embedding);
});

app.get('/produtos', (req, res) => {
  res.json(todosProdutos());
});

app.get('/produtos/estoque', (req, res) => {
  res.json(produtosEmEstoque());
});

app.get('/produtos/falta', (req, res) => {
  res.json(produtosEmFalta());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;