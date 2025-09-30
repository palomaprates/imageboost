import { supabase } from "@/services/supabaseClient";

export async function deleteHistoryItem(id: number): Promise<void> {
    const { error } = await supabase.from("images").delete().eq("id", id);
    if (error) throw new Error(error.message);
}
