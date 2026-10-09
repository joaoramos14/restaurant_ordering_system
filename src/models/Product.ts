import supabase from "../config/supabase.js";

type ProductInput = {
    category_id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    available: boolean;
    active: boolean;
};

async function findAll() {
    const { data, error } = await supabase
        .from("products")
        .select("*");

    if (error) {
        throw error;
    }

    return data;
}

async function findById(id: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return data;
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

async function create(product: ProductInput) {
    const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function update(id: string, product: Partial<ProductInput>) {
    const { data, error } = await supabase
        .from("products")
        .update(product)
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
        .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
        .order("title", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

export default {
    findAll,
    findById,
    findByCategoryId,
    create,
    update,
    remove,
    searchByKeyword
}
