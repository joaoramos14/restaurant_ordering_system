import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(express.json());

// ==============================
// Root
// ==============================

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Restaurant Ordering System API",
        version: "1.0.0",
    });
});

// ==============================
// Routes
// ==============================

app.use("/categories", categoryRoutes);

app.use("/products", productRoutes);

export default app;