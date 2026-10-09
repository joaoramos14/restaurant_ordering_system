import type { Request, Response } from "express";
import Product from "../models/Product.js";

async function getAll(req: Request, res: Response) {
    try {
        const products = await Product.findAll();

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
        const products = await Product.searchByKeyword(keyword);

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
        const products = await Product.findByCategoryId(categoryId);

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
        res.status(404).json({
            message: "ID do Produto não informado."
        });
        return;
    }

    try {
        const product = await Product.findById(id);

        res.status(200).json(product);
    } catch (error) {
        console.error("Erro ao buscar produto: ", error);

        res.status(404).json({
            message: "Produto não encontrado.",
        });
    }
}

async function create(req: Request, res: Response) {
    try {
        const product = await Product.create(req.body);

        res.status(200).json(product);
    } catch (error) {
        console.error("Erro ao criar produto: ", error);

        res.status(500).json({
            message: "Erro ao criar produto.",
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        res.status(404).json({
            message: "ID do Produto não informado."
        });
        return;
    }

    try {
        const product = await Product.update(id, req.body);

        res.status(200).json(product);
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
        res.status(404).json({
            message: "ID do Produto não informado."
        });
        return;
    }

    try {
        await Product.remove(id);

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

export default {
    getAll,
    getById,
    getByKeyword,
    getByCategory,
    create,
    update,
    remove
}
