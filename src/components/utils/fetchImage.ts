import { supabase } from "@/services/supabaseClient";
import type { Generation } from "../ImageComponents/ImageEditor";

export async function fetchImage(id: string): Promise<Generation> {
  const { data, error } = await supabase
    .from("images")
    .select()
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
