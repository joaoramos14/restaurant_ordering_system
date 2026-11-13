import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Restaurant Ordering System API",
            version: "1.0.0",
            description: "API REST para gerenciamento de categorias e produtos de um sistema de pedidos de um restaurante.",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
        ],
        tags: [
            {
                name: "Categories",
                description: "Gerenciamento de categorias",
            },
            {
                name: "Products",
                description: "Gerenciamento de produtos",
            },
        ],
        components: {
            schemas: {
                Category: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            example: "94dbbb23-126c-48e2-a2ea-10ac698079c5",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
