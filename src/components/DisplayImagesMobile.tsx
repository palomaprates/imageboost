import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ImageDownloadButton } from "./ImageDownloadButton";
import { useEffect, useState } from "react";

export default function DisplayImagesMobile({
  imageUrls,
}: {
  imageUrls: string[] | null;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  if (!imageUrls || imageUrls.length < 3) return null;
  const variations = imageUrls.slice(1, 3);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <Carousel setApi={setApi} className="w-full max-w-sm">
        <CarouselContent>
          {variations.map((url, i) => (
            <CarouselItem key={i}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={url}
                  alt={`Variação ${i + 1}`}
                  className="w-full h-96 object-cover rounded-3xl transition-all duration-500 ease-in-out"
                />
                <ImageDownloadButton imageUrl={url} className="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent rounded-3xl pointer-events-none" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-black/60 backdrop-blur-sm p-2 pr-4 rounded-xl">
                  <img
                    src={imageUrls[0]}
                    alt="Original"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-medium">
                      Original
                    </span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex justify-center gap-2 mt-6">
        {variations.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === i ? "bg-white scale-125" : "bg-gray-500"
            }`}
            aria-label={`Ir para variação ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
