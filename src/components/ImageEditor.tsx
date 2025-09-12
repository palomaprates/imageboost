import { useState } from "react";
import { supabase } from "../services/supabaseClient";
const anonKey = import.meta.env.VITE_ANON_KEY;

export default function ImageEditor() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);

  const handleUpload = async function uploadImage() {
    if (!image) {
      alert("selecione uma imagem");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      formData.append("file", image);
      if (user) {
        formData.append("user_id", user.id);
      }
      const res = await fetch(
        "http://127.0.0.1:54321/functions/v1/image-edit",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${anonKey}`,
            apikey: anonKey,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Erro na requisição");
      }
      const data = await res.json();
      setImageUrls([data.original, ...(data.variations || [])]);
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
      {imageUrls && (
        <div className="mt-4">
          <p>Original:</p>
          <img src={imageUrls[0]} alt="Original" className="mb-2" />
          <p>Variações:</p>
          <div className="flex gap-2">
            {imageUrls.slice(1).map((url, i) => (
              <img key={i} src={url} alt={`Variação ${i + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
