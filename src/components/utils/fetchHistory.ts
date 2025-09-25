import { supabase } from "@/services/supabaseClient";

export type HistoryItem = {
    id: number;
    image_url: string;
};

export const HISTORY_KEY = "history";

export async function fetchHistory(): Promise<HistoryItem[]> {
    const { data, error } = await supabase
        .from("images")
        .select("id, image_url")
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    return data;
}
