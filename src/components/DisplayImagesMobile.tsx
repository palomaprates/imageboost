import { useState } from "react";
import { ImageDownloadButton } from "./ImageDownloadButton";

export default function VariationsCarousel({
  imageUrls,
}: {
  imageUrls: string[] | null;
}) {
  if (!imageUrls || imageUrls.length < 3) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const variations = imageUrls.slice(1, 3);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex((prev) => (prev === 1 ? 0 : prev + 1));
    } else {
      setCurrentIndex((prev) => (prev === 0 ? 1 : prev - 1));
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div
        className="w-full max-w-sm overflow-hidden rounded-3xl relative"
        onTouchStart={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("button")) return;

          e.currentTarget.dataset.touchStart = e.touches[0].clientX.toString();
        }}
        onTouchEnd={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("button")) return;
          const touchStart = parseFloat(
            e.currentTarget.dataset.touchStart || "0"
          );
          const touchEnd = e.changedTouches[0].clientX;

          if (touchStart - touchEnd > 50) handleSwipe("left");
          if (touchEnd - touchStart > 50) handleSwipe("right");
        }}
      >
        <img
          src={variations[currentIndex]}
          alt={`Variação ${currentIndex + 1}`}
          className="w-full h-96 object-cover rounded-3xl transition-all duration-500 ease-in-out"
        />
        <ImageDownloadButton
          imageUrl={variations[currentIndex]}
          className="pointer-events-auto"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent rounded-3xl pointer-events-none" />
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
      <div className="flex justify-center gap-2 mt-6">
        {variations.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              i === currentIndex ? "bg-white scale-125" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
