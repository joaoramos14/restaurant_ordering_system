import supabase from "../config/supabase.js";
import { Category } from "../models/Category.js";

async function findAll() {
    const { data, error } = await supabase
        .from("categories")
        .select("*");

    if (error) {
        throw error;
    }

    return data;
}

async function findById(id: string): Promise<Category> {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return Category.restore(
        data.id,
        data.name,
        data.display_order,
        data.active,
        data.description,
        data.icon,
    );
}

async function create(category: Category) {
    const { data, error } = await supabase
        .from("categories")
        .insert({
            name: category.getName(),
            description: category.getDescription(),
            icon: category.getIcon(),
            display_order: category.getDisplayOrder(),
            active: category.isActive(),
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function update(category: Category) {
    const id = category.getId();
    if (!id) {
        throw new Error("Não é possível atualizar uma categoria sem ID.");
    }

    const { data, error } = await supabase
        .from("categories")
        .update({
            name: category.getName(),
            description: category.getDescription(),
            icon: category.getIcon(),
            display_order: category.getDisplayOrder(),
            active: category.isActive(),
        })
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
        .from("categories")
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
        .from("categories")
        .select("*")
        .or(`name.ilike.%${keyword}%, description.ilike.%${keyword}%`)
        .order("display_order", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

export default {
    findAll,
    findById,
    create,
    update,
    remove,
    searchByKeyword
};
