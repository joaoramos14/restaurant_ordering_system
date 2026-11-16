import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(express.json());

// ==============================
// Root
// ==============================
app.get("/", (req, res) => {
    res.redirect("/api-docs");
});

// ==============================
// Swagger Documentation
// ==============================
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec),
);

// ==============================
// Routes
// ==============================
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

export default app;