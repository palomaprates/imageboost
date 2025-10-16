import { useIsMobile } from "@/hooks/use-mobile";
import DisplayImagesMobile from "./DisplayImagesMobile";
import { ImageDownloadButton } from "./ImageDownloadButton";

export default function DisplayImages({
  imageUrls,
}: {
  imageUrls: string[] | null;
}) {
  if (!imageUrls || imageUrls.length < 3) return null;
  const isMobile = useIsMobile();
  const variations = imageUrls.slice(1);

  return isMobile ? (
    <DisplayImagesMobile imageUrls={imageUrls} />
  ) : (
    <div className="flex items-center justify-center p-10">
      <div className="flex flex-wrap justify-center gap-10">
        {variations.map((variationUrl, index) => (
          <div
            key={index}
            className="flex relative w-96 h-96 rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] max-w-sm"
          >
            <img
              src={variationUrl}
              alt={`Variação ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <ImageDownloadButton imageUrl={variationUrl} />
            <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-black/60 backdrop-blur-sm p-2 pr-4 rounded-xl">
              <img
                src={imageUrls[0]}
                alt="Original"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">Original</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
