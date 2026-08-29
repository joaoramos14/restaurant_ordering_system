import express from "express";
import { randomUUID } from "node:crypto";

const app = express();
app.use(express.json());

//=======================
// Initial data
//=======================
const pizzaCategoryId = randomUUID();
const drinksCategoryId = randomUUID();


const categories = [
  {
    "id": pizzaCategoryId,
    "name": "Pizzas",
    "description": "Pizzas com sabores clássicos, preparadas com ingredientes tradicionais."
  },
  {
    "id": drinksCategoryId,
    "name": "Bebidas",
    "description": "Refrigerantes, sucos, águas e outras bebidas para acompanhar o pedido."
  }
]

const products = [
  {
    "id": randomUUID(),
    "categoryID": pizzaCategoryId,
    "name": "Pizza Margherita",
    "description": "Molho de tomate, mussarela, tomate fresco, manjericão e azeite.",
    "price": 49.90
  },
  {
    "id": randomUUID(),
    "categoryID": pizzaCategoryId,
    "name": "Pizza Calabresa",
    "description": "Molho de tomate, mussarela, calabresa fatiada e cebola.",
    "price": 54.90
  },
  {
    "id": randomUUID(),
    "categoryID": pizzaCategoryId,
    "name": "Pizza Frango com Catupiry",
    "description": "Molho de tomate, mussarela, frango desfiado e Catupiry.",
    "price": 62.90
  },
  {
    "id": randomUUID(),
    "categoryID": drinksCategoryId,
    "name": "Coca-Cola 2L",
    "description": "Refrigerante Coca-Cola 2 litros.",
    "price": 15.90
  }
]

//=======================
// Root
//=======================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "API Restaurante",
        version: "1.0.0"
    });
});

//=======================
// Categorias
//=======================
app.get("/categories",(req, res) => {
    res.status(200).json(categories);
});

app.get("/categories/:id",(req, res) => {
    const category = categories.find((category) => {
      return category.id == req.params.id;
    });

    if(!category) {
      return res.status(404).json({
        message: "Categoria não encontrada."
      });
    }

    res.status(200).json(category);
});

app.post("/categories", (req, res) => {
  const category = {
    id: randomUUID(),
    ...req.body,
  }
  categories.push(category);
  res.status(201).json(category);
});

app.put("/categories/:id",(req, res) => {
    const category = categories.find((category) => {
      return category.id == req.params.id;
    });

    if(!category) {
      return res.status(404).json({
        message: "Categoria não encontrada."
      });
    }

    category.name = req.body.name;
    category.description = req.body.description;

    res.status(200).json(category);
});

app.delete("/categories/:id",(req, res) => {
    const category = categories.find((category) => {
      return category.id == req.params.id;
    });

    if(!category) {
      return res.status(404).json({
        message: "Categoria não encontrada."
      });
    }

    const index = categories.indexOf(category);
    categories.splice(index, 1);

    res.status(200).json({
      message: "Categoria removida com sucesso.",
    });
});

//=======================
// Produtos
//=======================
app.get("/products",(req, res) => {
    res.status(200).json(products);
});

app.get("/products/:id",(req, res) => {
    const product = products.find((product) => {
      return product.id == req.params.id;
    });

    if(!product) {
      return res.status(404).json({
        message: "Produto não encontrada."
      });
    }

    res.status(200).json(product);
});

app.post("/products", (req, res) => {
  const product = {
    id: randomUUID(),
    ...req.body,
  };
  products.push(product);
  res.status(201).json(product);
});

app.put("/products/:id",(req, res) => {
    const product = products.find((product) => {
      return product.id == req.params.id;
    });

    if(!product) {
      return res.status(404).json({
        message: "Produto não encontrada."
      });
    }

    product.categoryID = req.body.categoryID;
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;

    res.status(200).json(product);
});

app.delete("/products/:id",(req, res) => {
    const product = products.find((product) => {
      return product.id == req.params.id;
    });

    if(!product) {
      return res.status(404).json({
        message: "Produto não encontrada."
      });
    }

    const index = products.indexOf(product);
    products.splice(index, 1);

    res.status(200).json({
      message: "Produto removido com sucesso."
    });
});

export default app; 