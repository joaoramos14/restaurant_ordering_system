import supabase from "../config/supabase.js";
import { Product } from "../model/Product.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidantionError.js";

async function findAll() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
        throw error;
    }

    return data;
}

async function findById(id: string): Promise<Product> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Produto não encontrado.");
    }

    return Product.restore(
        data.id,
        data.category_id,
        data.title,
        data.price,
        data.available,
        data.active,
        data.description ?? undefined,
        data.image ?? undefined,
    );
}

async function searchByKeyword(keyword: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);

    if (error) {
        throw error;
    }

    return data;
}

async function create(product: Product) {
    const { data, error } = await supabase
        .from("products")
        .insert({
            category_id: product.getCategoryId(),
            title: product.getTitle(),
            description: product.getDescription(),
            price: product.getPrice(),
            image: product.getImage(),
            available: product.isAvailable(),
            active: product.isActive(),
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23503") {
            throw new ValidationError("A categoria informada não existe.");
        }

        throw error;
    }

    return data;
}

async function update(product: Product) {
    const id = product.getId();

    if (!id) {
        throw new Error("Produto sem ID não pode ser atualizado.");
    }

    const { data, error } = await supabase
        .from("products")
        .update({
            category_id: product.getCategoryId(),
            title: product.getTitle(),
            description: product.getDescription(),
            price: product.getPrice(),
            image: product.getImage(),
            available: product.isAvailable(),
            active: product.isActive(),
        })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Produto não encontrado.");
    }

    return data;
}

async function remove(id: string) {
    const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Produto não encontrado.");
    }

    return data;
}

export default {
    findAll,
    findById,
    searchByKeyword,
    create,
    update,
    remove,
};
