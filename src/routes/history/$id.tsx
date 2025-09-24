import { supabase } from "@/services/supabaseClient";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/history/$id")({
  component: HistoryRoute,
  validateSearch: (search: { url?: string }) => search,
});

function HistoryRoute() {
  const { id } = Route.useParams();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      const { data, error } = await supabase
        .from("images")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        console.log("URL da imagem:", data);
        setImage(data.image_url);
      }
    }

    fetchImage();
  }, [id]);

  return <div>{image && <img src={image} alt="history" />}</div>;
}
