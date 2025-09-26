import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import DisplayImages from "./DisplayImages";
import { useQueryClient } from "@tanstack/react-query";
import { HISTORY_KEY } from "./utils/fetchHistory";
import toBase64 from "./utils/toBase64";
import { LuImagePlus } from "react-icons/lu";

export default function ImageEditor() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
    <div className="p-4 max-w-l mx-auto flex flex-col justify-center items-center">
      <div
        className={`w-160 h-80 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 transition 
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-400 bg-auto"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setImage(e.dataTransfer.files[0]);
          }
        }}
      >
        <input
          id="fileInput"
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(
              e.target.files && e.target.files[0] ? e.target.files[0] : null
            )
          }
        />
        <label
          htmlFor="fileInput"
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-700 text-white font-light px-6 py-3 rounded-md cursor-pointer transition"
        >
          <LuImagePlus />
          Selecione sua imagem
        </label>
        <p className="text-gray-900 mt-4 font-light">Ou arraste aqui</p>
      </div>

      <button
        onClick={handleUpload}
        className="mt-4 p-2 w-160 bg-gray-900 text-white rounded-md cursor-pointer font-light"
        disabled={loading || !image}
      >
        {loading ? "Carregando..." : "Enviar"}
      </button>
      <div className="flex gap-2 mt-4 justify-center items-center">
        {imageUrls && imageUrls[0] && (
          <img src={imageUrls[0]} alt="preview" width={400} height={300} />
        )}
      </div>

      <DisplayImages imageUrls={imageUrls} />
    </div>
  );
}
