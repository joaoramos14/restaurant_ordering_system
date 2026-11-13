import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
app.use(express.json());

// =================
// Root
// =================
app.get("/", (req, res) =>
    res.redirect("/api-docs")
);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// =================
// Categories
// =================
app.use("/categories", categoryRoutes);


// =================
// Products
// =================
app.use("/products", productRoutes);

export default app;
