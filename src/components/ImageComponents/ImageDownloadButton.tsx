import { Download } from "lucide-react";
import { useState } from "react";

interface DownloadButtonProps {
  imageUrl: string;
  className?: string;
}

export function ImageDownloadButton({
  imageUrl,
  className,
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = imageUrl.split("/").pop() || "imagem.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Erro ao baixar imagem:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDownload();
      }}
      disabled={loading}
      className={`
        absolute bottom-7 right-2 p-2 rounded-full bg-black/60 text-white
        hover:bg-black/90 hover:scale-110 duration-300 transition-all cursor-pointer
        ${className || ""}`}
      title="Baixar imagem"
    >
      {loading ? <span className="text-xs">...</span> : <Download size={20} />}
    </button>
  );
}
