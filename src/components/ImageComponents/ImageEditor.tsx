import { useState, useEffect, useRef } from "react";
import { supabase } from "../../services/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { HISTORY_KEY } from "../utils/fetchHistory";
import toBase64 from "../utils/toBase64";
import { LuImagePlus } from "react-icons/lu";
import FileDetails from "../HistorySidebar/FileDetails";
import { useNavigate } from "@tanstack/react-router";

export type Generation = {
  id: string;
  image_url: string;
  variation_url: string;
  description: string;
  user_id: string;
  created_at: string;
};

export default function ImageEditor() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ref para manter a última URL de preview (blob) e revogá-la corretamente
  const prevPreviewRef = useRef<string | null>(null);

  const handleFile = (file: File) => {
    console.log("handleFile:", file.name, file.type, file.size);

    // permitir arquivos mesmo que não tenham MIME (alguns mobiles)
    const hasMime = !!file.type;

    if (hasMime && !file.type.startsWith("image/")) {
      console.warn("Arquivo não é uma imagem (mime):", file.type);
      return;
    }

    // prosseguir mesmo sem mime/extension — tentaremos ler
    setImage(file);

    // revoga preview anterior se for blob
    if (prevPreviewRef.current === undefined) prevPreviewRef.current = null;

    try {
      const url = URL.createObjectURL(file);
      // revoga anterior
      if (
        prevPreviewRef.current &&
        prevPreviewRef.current.startsWith("blob:")
      ) {
        try {
          URL.revokeObjectURL(prevPreviewRef.current);
        } catch (e) {
          // ignore
        }
      }
      prevPreviewRef.current = url;
      setPreview(url);
    } catch (err) {
      // fallback para FileReader quando createObjectURL não é suportado
      const reader = new FileReader();
      reader.onload = () => {
        // revoga anterior se blob
        if (
          prevPreviewRef.current &&
          prevPreviewRef.current.startsWith("blob:")
        ) {
          try {
            URL.revokeObjectURL(prevPreviewRef.current);
          } catch (e) {}
        }
        prevPreviewRef.current = null;
        setPreview(String(reader.result));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      if (
        prevPreviewRef.current &&
        prevPreviewRef.current.startsWith("blob:")
      ) {
        try {
          URL.revokeObjectURL(prevPreviewRef.current);
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const handleRemove = () => {
    if (prevPreviewRef.current && prevPreviewRef.current.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(prevPreviewRef.current);
      } catch (e) {}
      prevPreviewRef.current = null;
    }
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
      navigate({ to: "/app/loadingRoute" });
      const imageb64 = await toBase64(image);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("Você precisa estar logado");
      }

      const { data, error } = await supabase.functions.invoke<Generation>(
        "image-generator",
        {
          body: {
            file: imageb64,
          },
        }
      );
      if (error) {
        throw new Error("Erro na requisição");
      }
      if (!data?.id) throw new Error("Missing ID from generated image");
      await queryClient.refetchQueries({ queryKey: [HISTORY_KEY] });
      navigate({ to: "/app/history/$id", params: { id: data.id } });
    } catch (e) {
      alert("error");
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex gap-4 flex-col justify-center items-center">
      <div
        className={`flex w-full h-70 flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition 
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-orange-600 "}`}
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
          className="flex gap-2 items-center mt-8 px-6 py-3 bg-orange-600 hover:bg-orange-600  text-white font-montserrat rounded-xl shadow-lg transition cursor-pointer"
        >
          <LuImagePlus />
          <span className="flex justify-center text-sm md:text-md hover:md:text-lg hover:text-md">
            Selecione sua imagem
          </span>
        </label>
        <p className="text-orange-600 mt-4 font-montserrat select-none text-sm md:text-md">
          Ou arraste aqui
        </p>
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
        className="mb-8 w-full bg-orange-600 hover:bg-orange-700 hover:text-lg text-white
                     font-montserrat rounded-xl px-4 sm:px-6 py-3 shadow-md transition duration-300 cursor-pointer text-md"
        disabled={loading || !image}
      >
        {loading ? "Carregando..." : "Enviar"}
      </button>
    </div>
  );
}
