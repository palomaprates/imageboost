import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import DisplayImages from "./DisplayImages";
import { useQueryClient } from "@tanstack/react-query";
import { HISTORY_KEY } from "./utils/fetchHistory";

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
}

export default function ImageEditor() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  const queryClient = useQueryClient();

  const handleUpload = async function uploadImage() {
    if (!image) {
      alert("selecione uma imagem");
      return;
    }
    setLoading(true);
    try {
      const imageb64 = await toBase64(image);
      const { data, error } = await supabase.functions.invoke(
        "image-generator",
        {
          body: {
            file: imageb64,
            user_id: "8059f3bf-80d2-4d4e-8194-212a7bf5cacb",
          },
        }
      );

      if (error) {
        throw new Error("Erro na requisição");
      }

      queryClient.refetchQueries({ queryKey: [HISTORY_KEY] });

      setImageUrls([data.original, ...(data.variations || [])]);
      console.log("image no front", data.original);
    } catch (e) {
      alert("error");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImage(
            e.target.files && e.target.files[0] ? e.target.files[0] : null
          )
        }
      />
      <button
        onClick={handleUpload}
        className="mt-2 p-2 w-full bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Carregando..." : "Enviar"}
      </button>
      <DisplayImages imageUrls={imageUrls} />
    </div>
  );
}
