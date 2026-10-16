import supabase from "../config/supabase.js";
import { Product } from "../models/Product.js";

async function findAll() {
    const { data, error } = await supabase
        .from("products")
        .select("*");

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
        .single();

    if (error) {
        throw error;
    }

    return Product.restore(
        data.id,
        data.category_id,
        data.title,
        data.description,
        data.price,
        data.image,
        data.available,
        data.active,
    );
}

async function findByCategoryId(categoryId: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId)
        .order("title", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

async function create(product: Product) {
    const { data, error } = await supabase
        .from("products")
        .insert(toRecord(product))
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function update(product: Product) {
    const id = product.getId();
    if (!id) {
        throw new Error("Não é possível atualizar um produto sem ID.");
    }

    const { data, error } = await supabase
        .from("products")
        .update(toRecord(product))
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function remove(id: string) {
    const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function searchByKeyword(keyword: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`title.ilike.%${keyword}%, description.ilike.%${keyword}%`)
        .order("title", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

function toRecord(product: Product) {
    return {
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
    findAll,
    findById,
    findByCategoryId,
    create,
    update,
    remove,
    searchByKeyword,
};
