import { supabase } from "@/services/supabaseClient";

export async function updateDescription(id: number, newDescription: string) {
    const { data, error } = await supabase.from("images").update({
        description: newDescription,
    }).eq("id", id);

    if (error) throw new Error(error.message);

    return data;
}
