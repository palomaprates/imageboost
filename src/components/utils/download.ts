import type { Dispatch, SetStateAction } from "react";

export type downloadProps = {
    setLoading: Dispatch<SetStateAction<boolean>>;
    imageUrl: string;
};
export async function download({ setLoading, imageUrl }: downloadProps) {
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
}
