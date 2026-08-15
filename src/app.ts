import express from "express";

const app = express();

const categories = [

[
  {
    "id": 1,
    "name": "Pizzas Tradicionais",
    "description": "Pizzas com sabores clássicos, preparadas com ingredientes tradicionais."
  },
  {
    "id": 2,
    "name": "Pizzas Especiais",
    "description": "Pizzas com combinações exclusivas e ingredientes selecionados."
  },
  {
    "id": 3,
    "name": "Bebidas",
    "description": "Refrigerantes, sucos, águas e outras bebidas para acompanhar o pedido."
  }
]]

const products = [
    [
  {
    "id": 1,
    "categoryID": 1,
    "name": "Pizza Margherita",
    "description": "Molho de tomate, mussarela, tomate fresco, manjericão e azeite.",
    "price": 49.90
  },
  {
    "id": 2,
    "categoryID": 1,
    "name": "Pizza Calabresa",
    "description": "Molho de tomate, mussarela, calabresa fatiada e cebola.",
    "price": 54.90
  },
  {
    "id": 3,
    "categoryID": 2,
    "name": "Pizza Frango com Catupiry",
    "description": "Molho de tomate, mussarela, frango desfiado e Catupiry.",
    "price": 62.90
  },
  {
    "id": 4,
    "categoryID": 3,
    "name": "Coca-Cola 2L",
    "description": "Refrigerante Coca-Cola 2 litros.",
    "price": 15.90
  }
]]



app.get("/", (req, res) => {
    res.status(200).json({
        message: "API Restaurante",
        version: "1.0.0"
    });
});

app.get("/categories",(req, res) => {
    res.status(200).json(categories);
});

app.get("/products",(req, res) => {
    res.status(200).json(products);
});

export default app; 