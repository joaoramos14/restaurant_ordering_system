import supabase from "../config/supabase.js"

async function findAll() {
    const { data, error } = await supabase
    .from("products")
    .select("*");

    if (error) {
        throw error;
    }

    return data;
};

async function findById(id:string) {
    const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

    if (error) {
        throw error;
    }

    return data;
};

async function create(product:{
    name: string;
    description: string;
    icon: string;
    display_order: number;
    active: boolean;
}) {
    const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

    if(error) {
        throw error;
    }

    return data;

}



export default {
    findAll,
    findById,
    create
}