import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import supabase from "../config/supabase.js";

describe("Category - Testes de integração", () => {

    const testNames: string[] = [];

    function makeCategoryData() {
        const name = `Teste integração ${randomUUID()}`;
        testNames.push(name);
        return {
            name,
            display_order: 1,
            description: "Categoria criada pelo teste de integração",
            icon: "🍕",
        };
    }

    async function createCategory() {
        const data = makeCategoryData();
        const response = (await request(app).post("/categories").send(data));
        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));
        return {
            id: response.body.id as string,
            data,
        };
    }

    afterEach(async () => {
        const names = testNames.splice(0);
        if (names.length === 0) {
            return;
        }
        const { error } = await supabase
            .from("categories")
            .delete()
            .in("name", names);
        if (error) {
            throw new Error(`Falha ao limpar categorias do teste: ${error.message}`);
        }
    }, 20_000);

    it("deve criar uma categoria válida", async () => {
        const data = makeCategoryData();

        const response = await request(app).post("/categories").send(data);

        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));
        expect(response.body).toMatchObject({
            ...data,
            active: true,
        });
    });

    it("deve listar as categorias inclusive a categoria criada", async () => {
        const { id, data } = await createCategory();

        const response = await request(app).get("/categories");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id,
                    name: data.name,
                }),
            ]),
        );
    });

    it("deve consultar uma categoria existente por ID", async () => {
        const { id, data } = await createCategory();

        const response = await request(app).get(`/categories/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            ...data,
        });
    }, 20_000);

    it("deve buscar uma categoria por palavra-chave", async () => {
        const { id, data } = await createCategory();

        const response = await request(app)
            .get("/categories/search")
            .query({ keyword: data.name });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id,
                    name: data.name,
                }),
            ]),
        );
    });


    it("deve atualizar os dados de uma categoria", async () => {
        const { id, data } = await createCategory();

        const updatedData = {
            ...data,
            description: "Descrição atualizada pelo teste",
            icon: "🥤",
            display_order: 5,
            active: false,
        };

        const response = await request(app)
            .put(`/categories/${id}`)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            ...updatedData,
        });
    });

    it("deve remover uma categoria existente", async () => {
        const { id } = await createCategory();

        const response = await request(app)
            .delete(`/categories/${id}`);

        const { data, error } = await supabase
            .from("categories")
            .select("id")
            .eq("id", id)
            .maybeSingle();

        expect(error).toBeNull();
        expect(data).toBeNull();

        expect(response.status).toBe(200);
    });

})