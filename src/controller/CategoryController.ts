import type { Request, Response } from "express";
import { Category } from "../model/Category.js";
import CategoryRepository from "../repositories/CategoryRepository.js";
import { ValidationError } from "../errors/ValidantionError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

async function getAll(req: Request, res: Response) {
    try {
        const categories = await CategoryRepository.findAll();

        res.status(200).json(categories)
    } catch (error) {
        console.log("Erro ao buscar categorias: ", error);

        res.status(500).json({
            message: "Erro ao buscar categorias."
        });
    }
}

async function getByKeyword(req: Request, res: Response) {
    const { keyword } = req.query;

    if (!keyword || typeof keyword != "string") {
        return res.status(400).json({
            message: "Palavra-chave não informada."
        });
    }

    try {
        const categories = await CategoryRepository.searchByKeyword(keyword);

        res.status(200).json(categories);
    } catch (error) {
        console.log("Erro ao pesquisar categorias: ", error);

        res.status(500).json({
            message: "Erro ao pesquisar categorias.",
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({
            message: "ID da categoria não informado."
        });
    }

    try {
        const category = await CategoryRepository.findById(id);

        res.status(200).json({
            id: category.getId(),
            name: category.getName(),
            description: category.getDescription(),
            icon: category.getIcon(),
            display_order: category.getDisplayOrder(),
            active: category.isActive(),
        });
    } catch (error) {
        console.log("Erro ao buscar categoria: ", error);

        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao buscar categoria."
        });
    }
}

async function create(req: Request, res: Response) {
    const { name, display_order, description, icon } = req.body;

    try {
        const category = new Category(name, display_order, description, icon);

        const createdCategory = await CategoryRepository.create(category);

        res.status(201).json(createdCategory);
    } catch (error) {
        console.log("Erro ao criar categoria: ", error);

        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao criar categoria."
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { name, display_order, description, icon, active } = req.body;

    if (!id) {
        return res.status(404).json({
            message: "ID da categoria não informado."
        });
    }

    try {
        const category = await CategoryRepository.findById(id);

        if (name !== undefined) {
            category.rename(name);
        }

        if (description !== undefined) {
            category.changeDescription(description);
        }

        if (icon !== undefined) {
            category.changeIcon(icon);
        }

        if (display_order !== undefined) {
            category.changeDisplayOrder(display_order);
        }

        if (active === true) {
            category.activate();
        }

        if (active === false) {
            category.deactivate();
        }

        const updatedCategory = await CategoryRepository.update(category);

        res.status(200).json(updatedCategory)
    } catch (error) {
        console.log("Erro ao atualizar categoria: ", error);

        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.message,
            });
        }

        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao atualizar categoria."
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({
            message: "ID da categoria não informado."
        });
    }

    try {
        await CategoryRepository.remove(id);

        res.status(200).json({
            message: "Categoria removida com sucesso."
        })
    } catch (error) {
        console.log("Erro ao remover categoria: ", error);

        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao remover categoria."
        });
    }
}

export default {
    getAll,
    getByKeyword,
    getById,
    create,
    update,
    remove
}