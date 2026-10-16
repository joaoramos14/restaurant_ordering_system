import type { Request, Response } from "express";
import ProductRepository from "../repository/ProductRepository.js";
import { Product } from "../models/Product.js";

async function getAll(req: Request, res: Response) {
    try {
        const products = await ProductRepository.findAll();

        res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao buscar produtos: ", error);

        res.status(500).json({
            message: "Erro ao buscar produtos.",
        });
    }
}

async function getByKeyword(req: Request<{ keyword: string }>, res: Response) {
    const { keyword } = req.params;

    if (!keyword || typeof keyword != "string") {
        res.status(400).json({
            message: "Palavra-chave não informada."
        });
        return;
    }

    try {
        const products = await ProductRepository.searchByKeyword(keyword);

        res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao pesquisar por produto: ", error);

        res.status(500).json({
            message: "Erro ao pesquisar produto.",
        });
    }
}

async function getByCategory(req: Request<{ categoryId: string }>, res: Response) {
    const { categoryId } = req.params;

    if (!categoryId) {
        res.status(400).json({
            message: "ID da Categoria não informado."
        });
        return;
    }

    try {
        const products = await ProductRepository.findByCategoryId(categoryId);

        res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao buscar produtos da categoria: ", error);

        res.status(500).json({
            message: "Erro ao buscar produtos da categoria.",
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            message: "ID do Produto não informado."
        });
        return;
    }

    try {
        const product = await ProductRepository.findById(id);

        res.status(200).json(toResponse(product));
    } catch (error) {
        console.error("Erro ao buscar produto: ", error);

        res.status(404).json({
            message: "Produto não encontrado.",
        });
    }
}

async function create(req: Request, res: Response) {
    const { category_id, title, description, price, image, available, active } = req.body;

    if (
        typeof category_id !== "string"
        || typeof title !== "string"
        || typeof description !== "string"
        || typeof price !== "number"
        || typeof image !== "string"
        || typeof available !== "boolean"
        || typeof active !== "boolean"
    ) {
        res.status(400).json({
            message: "Dados obrigatórios do produto inválidos ou ausentes.",
        });
        return;
    }

    try {
        const product = new Product(category_id, title, description, price, image, available, active);
        const createdProduct = await ProductRepository.create(product);

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Erro ao criar produto: ", error);

        res.status(500).json({
            message: "Erro ao criar produto.",
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { category_id, title, description, price, image, available, active } = req.body;

    if (!id) {
        res.status(400).json({
            message: "ID do Produto não informado."
        });
        return;
    }

    if (
        (category_id !== undefined && typeof category_id !== "string")
        || (title !== undefined && typeof title !== "string")
        || (description !== undefined && typeof description !== "string")
        || (price !== undefined && typeof price !== "number")
        || (image !== undefined && typeof image !== "string")
        || (available !== undefined && typeof available !== "boolean")
        || (active !== undefined && typeof active !== "boolean")
    ) {
        res.status(400).json({
            message: "Dados do produto inválidos.",
        });
        return;
    }

    try {
        const product = await ProductRepository.findById(id);

        if (category_id !== undefined) product.changeCategoryId(category_id);
        if (title !== undefined) product.rename(title);
        if (description !== undefined) product.changeDescription(description);
        if (price !== undefined) product.changePrice(price);
        if (image !== undefined) product.changeImage(image);
        if (available !== undefined) product.setAvailable(available);
        if (active === true) product.activate();
        if (active === false) product.deactivate();

        const updatedProduct = await ProductRepository.update(product);

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Erro ao atualizar produto: ", error);

        res.status(500).json({
            message: "Erro ao atualizar produto.",
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            message: "ID do Produto não informado."
        });
        return;
    }

    try {
        await ProductRepository.remove(id);

        res.status(200).json({
            message: "Produto removido com sucesso.",
        });
    } catch (error) {
        console.error("Erro ao remover produto: ", error);

        res.status(500).json({
            message: "Erro ao remover produto.",
        });
    }
}

function toResponse(product: Product) {
    return {
        id: product.getId(),
        category_id: product.getCategoryId(),
        title: product.getTitle(),
        description: product.getDescription(),
        price: product.getPrice(),
        image: product.getImage(),
        available: product.isAvailable(),
        active: product.isActive(),
    };
}

export default {
    getAll,
    getById,
    getByKeyword,
    getByCategory,
    create,
    update,
    remove
};
