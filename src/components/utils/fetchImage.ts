import { supabase } from "@/services/supabaseClient";

export type Generation = {
  created_at: string;
  id: string;
  image_url: string;
  variations_url: string[];
};

export async function fetchImage(id: string): Promise<Generation> {
  const { data, error } = await supabase
    .from("images")
    .select()
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
