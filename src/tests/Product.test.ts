import { describe, it, expect } from "vitest";
import { Product } from "../model/Product.js";

describe("Product - Testes Unitários", () => {

    const category_id = "bdf4183d-79a0-4f6f-8ead-03400eb6ed60";

    // Produto com dados válidos
    it("deve criar um produto válido", () => {

        const title = "Pizza Calabresa";
        const price = 54.9;
        const description = "Molho de tomate, mussarela, calabresa fatiada e cebola.";
        const image = "pizza-calabresa.jpg";

        const product = new Product(
            category_id,
            title,
            price,
            description,
            image
        );

        expect(product.getCategoryId()).toBe("bdf4183d-79a0-4f6f-8ead-03400eb6ed60");
        expect(product.getTitle()).toBe("Pizza Calabresa");
        expect(product.getPrice()).toBe(54.9);
        expect(product.getDescription()).toBe("Molho de tomate, mussarela, calabresa fatiada e cebola.");
        expect(product.getImage()).toBe("pizza-calabresa.jpg");
        expect(product.isAvailable()).toBe(true);
        expect(product.isActive()).toBe(true);
        expect(product.getId()).toBeUndefined();
    });

    it("não deve permitir criar um produto com título vazio", () => {

        const title = "";
        const price = 54.9;

        expect(() => {
            new Product(category_id, title, price);
        }).toThrow("O título do produto é obrigatório.");
    });

    it("não deve permitir criar um produto com título contendo apenas espaços", () => {

        const title = "     ";//trim()
        const price = 54.9;

        expect(() => {
            new Product(category_id, title, price);
        }).toThrow("O título do produto é obrigatório.");
    });

    it("deve remover espaços antes e depois do título do produto", () => {

        const title = "  Pizza Calabresa   ";//trim()
        const price = 54.9;

        const product = new Product(category_id, title, price);

        expect(product.getTitle()).toBe("Pizza Calabresa");
    });

    it("não deve permitir criar um produto sem categoria", () => {

        const title = "Pizza Calabresa";
        const price = 54.9;

        expect(() => {
            new Product("", title, price);
        }).toThrow("A categoria do produto é obrigatória.");
    });

    it("não deve permitir criar um produto com categoria que não seja um UUID válido", () => {

        const title = "Pizza Calabresa";
        const price = 54.9;

        expect(() => {
            new Product("categoria-123", title, price);
        }).toThrow("O identificador da categoria deve ser um UUID válido.");
    });

    it("não deve permitir preço negativo", () => {

        const title = "Pizza Calabresa";
        const price = -1;

        expect(() => {
            new Product(category_id, title, price);
        }).toThrow("O preço do produto deve ser um número maior ou igual a zero.");
    });

    it("não deve permitir preço que não seja um número finito", () => {

        const title = "Pizza Calabresa";
        const price = Number.POSITIVE_INFINITY;

        expect(() => {
            new Product(category_id, title, price);
        }).toThrow("O preço do produto deve ser um número maior ou igual a zero.");
    });

    it("deve permitir preço igual a zero", () => {

        const title = "Água da casa";
        const price = 0;

        const product = new Product(category_id, title, price);

        expect(product.getPrice()).toBe(0);
    });

    it("deve permitir tornar um produto indisponível e disponível novamente", () => {

        const product = new Product(category_id, "Pizza Calabresa", 54.9);

        product.makeUnavailable();

        expect(product.isAvailable()).toBe(false);

        product.makeAvailable();

        expect(product.isAvailable()).toBe(true);
    });

    it("deve permitir desativar e reativar um produto", () => {

        const product = new Product(category_id, "Pizza Calabresa", 54.9);

        product.deactivate();

        expect(product.isActive()).toBe(false);

        product.activate();

        expect(product.isActive()).toBe(true);
    });

    it("deve permitir alterar o preço de um produto", () => {

        const product = new Product(category_id, "Pizza Calabresa", 54.9);

        product.changePrice(59.9);

        expect(product.getPrice()).toBe(59.9);
    });

    it("deve preservar o preço original após uma tentativa inválida de alteração", () => {

        const product = new Product(category_id, "Pizza Calabresa", 54.9);

        expect(() => {
            product.changePrice(-10);
        }).toThrow("O preço do produto deve ser um número maior ou igual a zero.");

        expect(product.getPrice()).toBe(54.9);
    });

    it("deve restaurar um produto existente", () => {

        const id = "6f1c2b8e-3d4a-4b5c-9e7f-0a1b2c3d4e5f";
        const title = "Pizza Calabresa";
        const price = 54.9;
        const available = false;
        const active = false;
        const description = "Molho de tomate, mussarela, calabresa fatiada e cebola.";
        const image = "pizza-calabresa.jpg";

        const product = Product.restore(
            id,
            category_id,
            title,
            price,
            available,
            active,
            description,
            image
        );

        expect(product.getId()).toBe("6f1c2b8e-3d4a-4b5c-9e7f-0a1b2c3d4e5f");
        expect(product.getCategoryId()).toBe("bdf4183d-79a0-4f6f-8ead-03400eb6ed60");
        expect(product.getTitle()).toBe("Pizza Calabresa");
        expect(product.getPrice()).toBe(54.9);
        expect(product.isAvailable()).toBe(false);
        expect(product.isActive()).toBe(false);
        expect(product.getDescription()).toBe("Molho de tomate, mussarela, calabresa fatiada e cebola.");
        expect(product.getImage()).toBe("pizza-calabresa.jpg");
    });

    it("deve permitir renomear um produto existente", () => {

        const product = new Product(category_id, "Pizza Calabresa", 54.9);

        product.rename("Pizza Portuguesa");

        expect(product.getTitle()).toBe("Pizza Portuguesa");
    });

    it("deve preservar o título original após uma tentativa inválida de renomeação", () => {

        const product = new Product(category_id, "Pizza Calabresa", 54.9);

        expect(() => {
            product.rename("");
        }).toThrow("O título do produto é obrigatório.");

        expect(product.getTitle()).toBe("Pizza Calabresa")

    });

    it("deve permitir alterar a categoria de um produto", () => {

        const product = new Product(category_id, "Pizza Calabresa", 54.9);

        product.changeCategory("80f5d4b4-ad10-4ebc-ac08-62694baff24a");

        expect(product.getCategoryId()).toBe("80f5d4b4-ad10-4ebc-ac08-62694baff24a");
    });

    it("deve permitir alterar a descrição de um produto", () => {

        const product = new Product(category_id, "Pizza Calabresa", 54.9, "Pizza de calabresa");

        product.changeDescription("Pizza de calabresa com cebola");

        expect(product.getDescription()).toBe("Pizza de calabresa com cebola");
    });

    it("deve permitir alterar a imagem de um produto", () => {

        const product = new Product(category_id, "Pizza Calabresa", 54.9, "Pizza de calabresa", "pizza-calabresa.jpg");

        product.changeImage("pizza-calabresa-nova.jpg");

        expect(product.getImage()).toBe("pizza-calabresa-nova.jpg");
    });
});
