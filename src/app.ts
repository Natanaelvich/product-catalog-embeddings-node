import 'dotenv/config';
import express from 'express';
import { createVector, embedProducts, generateCart, generateEmbedding, generateProducts, uploadFile } from "./openai";
import { produtosEmEstoque, produtosEmFalta, todosProdutos, produtosSimilares } from "./database";
import { createReadStream } from 'fs';
import path from 'path';

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

app.post("/cart", async (req, res) => {
    const { input } = req.body;
    const embedding = await generateEmbedding(input);
    if (!embedding) {
      res.status(500).json({ error: 'Embedding não gerada' });
      return;
    }
    const produtos = produtosSimilares(embedding);
    res.json(produtos.map(p => ({ nome: p.nome, similaridade: p.similaridade })));
  });

  app.post('/response', async (req, res) => {
    const { input } = req.body;
  
    const cart = await generateCart(input, ['feijão', 'detergente']);
  
    res.json(cart);
  })

  app.post('/upload', async (req, res) => {
    const file = createReadStream(path.join(__dirname, '..', 'static', 'recipes.md'));
    uploadFile(file)
    res.status(201).end();
  })
  
  app.post('/vector-store', async (req, res) => {
    await createVector();
    res.status(201).end();
  })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;