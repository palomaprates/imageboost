import { Download } from "lucide-react";
import { useState } from "react";
import { download } from "../utils/download";

interface DownloadButtonProps {
  imageUrl: string;
  className?: string;
}

export function ImageDownloadButton({
  imageUrl,
  className,
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    download({ setLoading, imageUrl });
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
