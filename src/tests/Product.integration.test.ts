import { randomUUID } from "node:crypto";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import supabase from "../config/supabase.js";

describe("Product - Testes de integração", () => {

    const testTitles: string[] = [];
    let categoryId: string;

    beforeAll(async () => {
        const { data, error } = await supabase
            .from("categories")
            .insert({
                name: `Teste integração produtos ${randomUUID()}`,
                description: "Categoria criada pelo teste de integração de produtos",
                icon: "🍕",
                display_order: 1,
                active: true,
            })
            .select()
            .single();
        if (error) {
            throw new Error(`Falha ao criar categoria do teste: ${error.message}`);
        }
        categoryId = data.id;
    }, 20_000);

    function makeProductData() {
        const title = `Teste integração ${randomUUID()}`;
        testTitles.push(title);
        return {
            category_id: categoryId,
            title,
            price: 49.9,
            description: "Produto criado pelo teste de integração",
            image: "pizza.jpg",
        };
    }

    async function createProduct() {
        const data = makeProductData();
        const response = (await request(app).post("/products").send(data));
        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));
        return {
            id: response.body.id as string,
            data,
        };
    }

    afterEach(async () => {
        const titles = testTitles.splice(0);
        if (titles.length === 0) {
            return;
        }
        const { error } = await supabase
            .from("products")
            .delete()
            .in("title", titles);
        if (error) {
            throw new Error(`Falha ao limpar produtos do teste: ${error.message}`);
        }
    }, 20_000);

    afterAll(async () => {
        const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", categoryId);
        if (error) {
            throw new Error(`Falha ao limpar categoria do teste: ${error.message}`);
        }
    }, 20_000);

    it("deve criar um produto válido", async () => {
        const data = makeProductData();

        const response = await request(app).post("/products").send(data);

        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));
        expect(response.body).toMatchObject({
            ...data,
            available: true,
            active: true,
        });
    });

    it("não deve criar um produto com categoria inexistente", async () => {
        const data = {
            ...makeProductData(),
            category_id: randomUUID(),
        };

        const response = await request(app).post("/products").send(data);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("A categoria informada não existe.");
    });

    it("deve listar os produtos inclusive o produto criado", async () => {
        const { id, data } = await createProduct();

        const response = await request(app).get("/products");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id,
                    title: data.title,
                }),
            ]),
        );
    });

    it("deve consultar um produto existente por ID", async () => {
        const { id, data } = await createProduct();

        const response = await request(app).get(`/products/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            ...data,
        });
    }, 20_000);

    it("deve retornar 404 ao consultar um produto inexistente", async () => {
        const response = await request(app).get(`/products/${randomUUID()}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Produto não encontrado.");
    });

    it("deve buscar um produto por palavra-chave", async () => {
        const { id, data } = await createProduct();

        const response = await request(app)
            .get("/products/search")
            .query({ keyword: data.title });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id,
                    title: data.title,
                }),
            ]),
        );
    });


    it("deve atualizar os dados de um produto", async () => {
        const { id, data } = await createProduct();

        const updatedData = {
            ...data,
            description: "Descrição atualizada pelo teste",
            price: 59.9,
            image: "pizza-nova.jpg",
            available: false,
            active: false,
        };

        const response = await request(app)
            .put(`/products/${id}`)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            ...updatedData,
        });
    });

    it("deve remover um produto existente", async () => {
        const { id } = await createProduct();

        const response = await request(app)
            .delete(`/products/${id}`);

        const { data, error } = await supabase
            .from("products")
            .select("id")
            .eq("id", id)
            .maybeSingle();

        expect(error).toBeNull();
        expect(data).toBeNull();

        expect(response.status).toBe(200);
    });

})
