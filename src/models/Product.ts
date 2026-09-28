import supabase from "../config/supabase.js";

async function findAll() {
    const { data, error } = await supabase
        .from("products")
        .select("*");

    if (error) {
        throw error;
    }

    return data;
}



export default {
    findAll,
}