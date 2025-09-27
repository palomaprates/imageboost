import { useState } from "react";
import { supabase } from "../services/supabaseClient";
// import DisplayImages from "./DisplayImages";
import { useQueryClient } from "@tanstack/react-query";
import { HISTORY_KEY } from "./utils/fetchHistory";
import toBase64 from "./utils/toBase64";
import { LuImagePlus } from "react-icons/lu";
import FileDetails from "./FileDetails";

export default function ImageEditor() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleFile = (file: File) => {
    console.log("handleFile:", file.name, file.type, file.size);
    if (!file.type || !file.type.startsWith("image/")) {
      console.warn(
        "Ficheiro não é uma imagem (ou MIME desconhecido):",
        file.type
      );
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleRemove = () => {
    setImage(null);
    setPreview(null);
  };
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
    <div className="w-full flex gap-4 flex-col justify-center items-center">
      <div
        className={`flex w-full h-70 flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition 
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-red-600 "}`}
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
            handleFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <input
          id="fileInput"
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
              e.target.value = "";
            }
          }}
        />
        <label
          htmlFor="fileInput"
          className="flex gap-2 items-center mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition"
        >
          <LuImagePlus />
          Selecione sua imagem
        </label>
        <p className="text-red-600 mt-4 font-semibold">Ou arraste aqui</p>
      </div>
      {preview && (
        <FileDetails
          preview={preview}
          fileName={image?.name ?? ""}
          fileSize={image?.size ?? 0}
          onRemove={handleRemove}
        />
      )}

      <button
        onClick={handleUpload}
        className="mb-8 w-full bg-white hover:bg-gray-100 text-red-600
                     font-semibold rounded-xl px-4 sm:px-6 py-3 shadow-md transition"
        disabled={loading || !image}
      >
        {loading ? "Carregando..." : "Enviar"}
      </button>
    </div>

    /* </div> */
    /* <DisplayImages imageUrls={imageUrls} /> */
    // </div>
  );
}
