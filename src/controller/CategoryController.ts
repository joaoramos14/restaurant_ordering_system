import type { Request, Response } from "express";
import CategoryRepository from "../repository/CategoryRepository.js";
import { Category } from "../models/Category.js";

async function getAll(req: Request, res: Response) {
    try {
        const categories = await CategoryRepository.findAll();

        res.status(200).json(categories);
    } catch (error) {
        console.error("Erro ao buscar categorias: ", error);

        res.status(500).json({
            message: "Erro ao buscar categorias.",
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
        const categories = await CategoryRepository.searchByKeyword(keyword);

        res.status(200).json(categories);
    } catch (error) {
        console.error("Erro ao pesquisar por categoria: ", error);

        res.status(500).json({
            message: "Erro ao pesquisar categoria.",
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            message: "ID da Categoria não informado."
        });
        return;
    }

    try {
        const category = await CategoryRepository.findById(id);

        res.status(200).json(toResponse(category));
    } catch (error) {
        console.error("Erro ao buscar categoria: ", error);

        res.status(404).json({
            message: "Categoria não encontrada.",
        });
    }
}

async function create(req: Request, res: Response) {
    const { name, display_order, description, icon } = req.body;

    if (typeof name !== "string" || typeof display_order !== "number") {
        res.status(400).json({
            message: "Nome e ordem de exibição são obrigatórios.",
        });
        return;
    }

    try {
        const category = new Category(name, display_order, description, icon);
        const createdCategory = await CategoryRepository.create(category);

        res.status(201).json(createdCategory);
    } catch (error) {
        console.error("Erro ao criar categoria: ", error);

        res.status(500).json({
            message: "Erro ao criar categoria.",
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { name, display_order, description, icon, active } = req.body;

    if (!id) {
        res.status(400).json({
            message: "ID da Categoria não informado."
        });
        return;
    }

    if (
        (name !== undefined && typeof name !== "string")
        || (display_order !== undefined && typeof display_order !== "number")
        || (description !== undefined && typeof description !== "string")
        || (icon !== undefined && typeof icon !== "string")
        || (active !== undefined && typeof active !== "boolean")
    ) {
        res.status(400).json({
            message: "Dados da categoria inválidos.",
        });
        return;
    }

    try {
        const category = await CategoryRepository.findById(id);

        if (name !== undefined) category.rename(name);
        if (display_order !== undefined) category.changeDisplayOrder(display_order);
        if (description !== undefined) category.changeDescription(description);
        if (icon !== undefined) category.changeIcon(icon);
        if (active === true) category.activate();
        if (active === false) category.deactivate();

        const updatedCategory = await CategoryRepository.update(category);

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Erro ao atualizar categoria: ", error);

        res.status(500).json({
            message: "Erro ao atualizar categoria.",
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            message: "ID da Categoria não informado."
        });
        return;
    }

    try {
        await CategoryRepository.remove(id);

        res.status(200).json({
            message: "Categoria removida com sucesso.",
        });
    } catch (error) {
        console.error("Erro ao remover categoria: ", error);

        res.status(500).json({
            message: "Erro ao remover categoria.",
        });
    }
}

function toResponse(category: Category) {
    return {
        id: category.getId(),
        name: category.getName(),
        description: category.getDescription(),
        icon: category.getIcon(),
        display_order: category.getDisplayOrder(),
        active: category.isActive(),
    };
}

export default {
    getAll,
    getById,
    getByKeyword,
    create,
    update,
    remove
};
