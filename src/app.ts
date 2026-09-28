import express from "express";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();
app.use(express.json());

// =================
// Root
// =================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "API Restaurante",
        version: "1.0.0"
    });
});

// =================
// Categories
// =================
app.use("/categories", categoryRoutes);


// =================
// Products
// =================
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

export default app;