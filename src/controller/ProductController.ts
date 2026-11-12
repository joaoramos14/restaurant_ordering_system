import type { Request, Response } from "express";
import { Product } from "../model/Product.js";
import ProductRepository from "../repositories/ProductRepository.js";
import { ValidationError } from "../errors/ValidantionError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

async function getAll(req: Request, res: Response) {
    try {
        const products = await ProductRepository.findAll();

        return res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);

        return res.status(500).json({
            message: "Erro ao buscar produtos.",
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do produto não informado.",
        });
    }

    try {
        const product = await ProductRepository.findById(id);

        return res.status(200).json({
            id: product.getId(),
            category_id: product.getCategoryId(),
            title: product.getTitle(),
            description: product.getDescription(),
            price: product.getPrice(),
            image: product.getImage(),
            available: product.isAvailable(),
            active: product.isActive(),
        });
    } catch (error) {
        console.error("Erro ao buscar produto:", error);

        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Erro interno ao buscar produto.",
        });
    }
}

async function search(req: Request, res: Response) {
    const { keyword } = req.query;

    if (!keyword || typeof keyword !== "string") {
        return res.status(400).json({
            message: "Palavra-chave não informada.",
        });
    }

    try {
        const products = await ProductRepository.searchByKeyword(keyword);

        return res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao pesquisar produtos:", error);

        return res.status(500).json({
            message: "Erro ao pesquisar produtos.",
        });
    }
}

async function create(req: Request, res: Response) {
    const { category_id, title, price, description, image } = req.body;

    try {
        const product = new Product(category_id, title, price, description, image);

        const createdProduct = await ProductRepository.create(product);

        return res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Erro ao criar produto:", error);

        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Erro interno ao criar produto.",
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { category_id, title, price, description, image, available, active } =
        req.body;

    if (!id) {
        return res.status(400).json({
            message: "ID do produto não informado.",
        });
    }

    try {
        const product = await ProductRepository.findById(id);

        if (category_id !== undefined) {
            product.changeCategory(category_id);
        }

        if (title !== undefined) {
            product.rename(title);
        }

        if (price !== undefined) {
            product.changePrice(price);
        }

        if (description !== undefined) {
            product.changeDescription(description);
        }

        if (image !== undefined) {
            product.changeImage(image);
        }

        if (available === true) {
            product.makeAvailable();
        }

        if (available === false) {
            product.makeUnavailable();
        }

        if (active === true) {
            product.activate();
        }

        if (active === false) {
            product.deactivate();
        }

        const updatedProduct = await ProductRepository.update(product);

        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);

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

        return res.status(500).json({
            message: "Erro interno ao atualizar produto.",
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do produto não informado.",
        });
    }

    try {
        await ProductRepository.remove(id);

        return res.status(200).json({
            message: "Produto removido com sucesso.",
        });
    } catch (error) {
        console.error("Erro ao remover produto:", error);

        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Erro interno ao remover produto.",
        });
    }
}

export default {
    getAll,
    getById,
    search,
    create,
    update,
    remove,
};
