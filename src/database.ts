const produtos: {
    nome: string;
    estoque: number;
    descricao: string;
    embedding?: number[];
  }[] = [
    {
      nome: "Feijão",
      estoque: 10,
      descricao:
        "Grão rico em proteínas e fibras, essencial na alimentação brasileira.",
    },
    {
      nome: "Feijão Verde",
      estoque: 10,
      descricao: "Tipo de feijão fresco, tradicionalmente utilizado em pratos nordestinos como o arrumadinho."
    },
    {
      nome: "Leite de Coco",
      estoque: 10,
      descricao: "Ingrediente líquido extraído do coco, utilizado para dar sabor e cremosidade a pratos como moquecas e bobós."
    },
    {
      nome: "Azeite de Dendê",
      estoque: 10,
      descricao: "Óleo vegetal de cor intensa e aroma forte, utilizado em pratos típicos da culinária baiana."
    },
    {
      nome: "Arroz",
      estoque: 10,
      descricao:
        "Cereal básico da dieta, utilizado em pratos do dia a dia e culinária brasileira.",
    },
    {
      nome: "Macarrão",
      estoque: 10,
      descricao:
        "Massa alimentícia feita de trigo, base para diversos tipos de refeições.",
    },
    {
      nome: "Óleo",
      estoque: 10,
      descricao: "Óleo vegetal usado para fritura e preparo de alimentos.",
    },
    {
      nome: "Açúcar",
      estoque: 10,
      descricao:
        "Ingrediente doce utilizado em bebidas, sobremesas e preparações culinárias.",
    },
    {
      nome: "Sal",
      estoque: 10,
      descricao: "Condimento essencial para realçar o sabor dos alimentos.",
    },
    {
      nome: "Farinha",
      estoque: 10,
      descricao: "Farinha de trigo utilizada em pães, bolos, massas e empanados.",
    },
    {
      nome: "Carne de Charque",
      estoque: 10,
      descricao: "Carne salgada e seca, tradicional da culinária nordestina.",
    },
    {
      nome: "Carne de Sol",
      estoque: 10,
      descricao:
        "Carne levemente salgada e curada ao sol, típica do Nordeste brasileiro.",
    },
    {
      nome: "Macaxeira",
      estoque: 10,
      descricao:
        "Raiz rica em amido, também conhecida como mandioca, usada em diversas receitas.",
    },
    {
      nome: "Café",
      estoque: 10,
      descricao: "Bebida estimulante feita a partir de grãos torrados de café.",
    },
    {
      nome: "Leite",
      estoque: 10,
      descricao:
        "Bebida nutritiva, fonte de cálcio, consumida pura ou em receitas.",
    },
    {
      nome: "Iogurte Grego",
      estoque: 10,
      descricao: "Iogurte espesso e cremoso, rico em proteínas.",
    },
    {
      nome: "Queijo Manteiga",
      estoque: 10,
      descricao:
        "Queijo tradicional do Nordeste, com textura macia e sabor amanteigado.",
    },
    {
      nome: "Pão francês",
      estoque: 10,
      descricao:
        "Pão crocante por fora e macio por dentro, consumido no café da manhã.",
    },
    {
      nome: "Pão Integral",
      estoque: 10,
      descricao: "Pão feito com farinha integral, fonte de fibras e nutrientes.",
    },
    {
      nome: "Presunto",
      estoque: 10,
      descricao: "Carne suína curada e fatiada, usada em sanduíches e receitas.",
    },
    {
      nome: "Aveia",
      estoque: 10,
      descricao:
        "Cereal nutritivo, rico em fibras, ideal para cafés da manhã e receitas saudáveis.",
    },
    {
      nome: "Maçã",
      estoque: 10,
      descricao: "Fruta doce e crocante, rica em fibras e vitaminas.",
    },
    {
      nome: "Banana",
      estoque: 10,
      descricao:
        "Fruta energética, rica em potássio e fibras, ideal para lanches.",
    },
    {
      nome: "Laranja",
      estoque: 10,
      descricao:
        "Fruta cítrica rica em vitamina C, consumida fresca ou em sucos.",
    },
    {
      nome: "Uva",
      estoque: 10,
      descricao: "Fruta doce consumida in natura ou usada em sucos e sobremesas.",
    },
    {
      nome: "Manga",
      estoque: 10,
      descricao: "Fruta tropical, doce e suculenta, rica em vitaminas.",
    },
    {
      nome: "Frango",
      estoque: 10,
      descricao:
        "Carne branca versátil, usada em diversas preparações culinárias.",
    },
    {
      nome: "Carne Moída",
      estoque: 10,
      descricao:
        "Carne bovina moída, ideal para molhos, hambúrgueres e recheios.",
    },
    {
      nome: "Peixe",
      estoque: 10,
      descricao:
        "Fonte de proteínas magras e ômega-3, consumido assado, grelhado ou frito.",
    },
    {
      nome: "Farofa",
      estoque: 10,
      descricao:
        "Mistura de farinha de mandioca com temperos, tradicional em churrascos e feijoadas.",
    },
    {
      nome: "Mussarela",
      estoque: 10,
      descricao:
        "Queijo macio e derretido, usado em pizzas, sanduíches e pratos gratinados.",
    },
    {
      nome: "Calabresa",
      estoque: 10,
      descricao:
        "Linguiça defumada e condimentada, ideal para pizzas e feijoadas.",
    },
    {
      nome: "Tomate",
      estoque: 10,
      descricao:
        "Fruto versátil, utilizado em saladas, molhos e receitas diversas.",
    },
    {
      nome: "Cebola",
      estoque: 10,
      descricao:
        "Ingrediente aromático básico para temperar e cozinhar alimentos.",
    },
    {
      nome: "Pimentão",
      estoque: 10,
      descricao:
        "Vegetal colorido e saboroso, usado em saladas, refogados e recheios.",
    },
    {
      nome: "Azeitona",
      estoque: 10,
      descricao: "Fruto utilizado para dar sabor a pratos, saladas e pizzas.",
    },
    {
      nome: "Orégano",
      estoque: 10,
      descricao: "Erva aromática usada para temperar pizzas, massas e carnes.",
    },
    {
      nome: "Manjericão",
      estoque: 10,
      descricao:
        "Erva de aroma intenso, usada em molhos, saladas e pratos italianos.",
    },
    {
      nome: "Alga Nori",
      estoque: 10,
      descricao:
        "Alga marinha usada principalmente no preparo de sushi e pratos orientais.",
    },
    {
      nome: "Wasabi",
      estoque: 10,
      descricao:
        "Condimento picante de origem japonesa, tradicionalmente servido com sushi.",
    },
    {
      nome: "Molho de Soja",
      estoque: 10,
      descricao:
        "Condimento fermentado salgado, essencial na culinária oriental.",
    },
    {
      nome: "Salmão",
      estoque: 10,
      descricao:
        "Peixe de carne rosada, rico em ômega-3, usado em sashimis e grelhados.",
    },
    {
      nome: "Atum",
      estoque: 10,
      descricao: "Peixe versátil usado em saladas, sushi e sanduíches.",
    },
    {
      nome: "Detergente",
      estoque: 10,
      descricao: "Produto de limpeza utilizado para lavar utensílios de cozinha.",
    },
    {
      nome: "Desinfetante",
      estoque: 10,
      descricao: "Produto de limpeza usado para higienizar pisos e superfícies.",
    },
    {
      nome: "Sabão em Pó",
      estoque: 10,
      descricao: "Detergente em pó para lavagem de roupas.",
    },
    {
      nome: "Amaciante",
      estoque: 10,
      descricao:
        "Produto que deixa as roupas macias e perfumadas após a lavagem.",
    },
    {
      nome: "Desodorante",
      estoque: 10,
      descricao:
        "Produto de higiene pessoal usado para controlar odores corporais.",
    },
    {
      nome: "Shampoo",
      estoque: 10,
      descricao:
        "Produto de higiene capilar usado para limpar o couro cabeludo e os cabelos.",
    },
    {
      nome: "Condicionador",
      estoque: 10,
      descricao:
        "Produto utilizado após o shampoo para hidratar e desembaraçar os cabelos.",
    },
    {
      nome: "Creme Dental",
      estoque: 10,
      descricao:
        "Produto usado na higiene bucal para limpeza e proteção dos dentes.",
    },
    {
      nome: "Escova de Dente",
      estoque: 10,
      descricao: "Instrumento de higiene bucal utilizado para escovar os dentes.",
    },
  ];
  
  export const produtosEmEstoque = () => {
    return produtos.filter((produto) => produto.estoque > 0).map(p => p.nome);
  };
  
  export const produtosEmFalta = () => {
    return produtos.filter((produto) => produto.estoque === 0).map(p => p.nome);
  };
  
  export const todosProdutos = () => [...produtos];
  export const setarEmbedding = (index: number, embedding: number[]) =>
    (produtos[index].embedding = embedding);

  function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
  
  export const produtosSimilares = (embedding: number[]) => {
    return produtos
      .filter(p => p.embedding)
      .map(p => ({
        ...p,
        similaridade: cosineSimilarity(p.embedding!, embedding)
      }))
      .sort((a, b) => b.similaridade - a.similaridade)
      .slice(0, 10)
  }