import { Download } from "lucide-react";
import { useRef, useState } from "react";

interface DownloadButtonProps {
  imageUrl: string;
  className?: string;
}

export function ImageDownloadButton({
  imageUrl,
  className,
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (linkRef.current) {
        linkRef.current.href = blobUrl;
        linkRef.current.download = imageUrl.split("/").pop() || "imagem.jpg";
        linkRef.current.click();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      }
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Erro ao baixar imagem:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <a
        ref={linkRef}
        style={{ display: "none" }}
        target="_blank"
        rel="noopener noreferrer"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
        disabled={loading}
        className={`
        absolute bottom-7 right-2 p-2 rounded-full bg-black/60 text-white
        hover:bg-black/90 transition-all cursor-pointer
        ${className || ""}`}
        title="Baixar imagem"
      >
        {loading ? (
          <span className="text-xs">...</span>
        ) : (
          <Download size={20} />
        )}
      </button>
    </>
  );
}
