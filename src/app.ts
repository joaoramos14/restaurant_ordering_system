import express from "express";
import supabase from "./config/supabase.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

const app = express();
app.use(express.json());

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
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias: ", error);

    res.status(500).json({
      message: "Erro ao buscar categorias.",
    });
  }
});

app.get("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    console.error("Erro ao buscar categoria: ", error);

    res.status(500).json({
      message: "Erro ao buscar categoria.",
    });
  }
});

app.post("/categories", async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(200).json(category);
  } catch (error) {
    console.error("Erro ao criar categoria: ", error);

    res.status(500).json({
      message: "Erro ao criar categoria.",
    });
  }
});

app.put("/categories/:id", async (req, res) => {
  try {
    const category = await Category.update(
      req.params.id,
      req.body
    );

    res.status(200).json(category);
  } catch (error) {
    console.error("Erro ao alterar categoria: ", error);

    res.status(500).json({
      message: "Erro ao alterar categoria.",
    });
  }
});

app.delete("/categories/:id", async (req, res) => {
  try {
    await Category.remove(req.params.id);

    res.status(200).json({
      message: "Categoria removida com sucesso."
    });
  } catch (error) {
    console.error("Erro ao remover categoria: ", error);

    res.status(404).json({
      message: "Categoria não encontrada.",
    });
  }
});

//=======================
// Produtos
//=======================
app.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos: ", error);

    res.status(500).json({
      message: "Erro ao buscar produtos.",
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao buscar produto: ", error);

    res.status(500).json({
      message: "Erro ao buscar produto.",
    })
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao criar produto: ", error);

    res.status(500).json({
      message: "Erro ao criar produto."
    });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.update(
      req.params.id,
      req.body
    );

    res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao alterar produto: ", error);

    res.status(500).json({
      message: "Erro ao alterar produto.",
    });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    await Product.remove(req.params.id);

    res.status(200).json({
      message: "Produto removido com sucesso."
    });
  } catch (error) {
    console.error("Erro ao remover produto: ", error);

    res.status(404).json({
      message: "Produto não encontrado.",
    });
  }
});

// ======================
// Supabase
// ======================


export default app; 