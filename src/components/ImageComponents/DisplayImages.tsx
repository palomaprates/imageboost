import { useState } from "react";
import { download } from "../utils/download";
import { ImageDownloadButton } from "./ImageDownloadButton";

export type DisplayImagesProps = {
  originalImageUrl: string;
  variationImageUrl: string;
};

export default function DisplayImages({
  originalImageUrl,
  variationImageUrl,
}: DisplayImagesProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-center p-10">
      <div className="flex flex-wrap justify-center gap-10">
        <div className="flex relative md:w-100 md:h-100 h-80 w-80 rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] max-w-sm">
          <img
            src={variationImageUrl}
            alt={"Variação"}
            className="w-full h-full object-cover"
          />
          <ImageDownloadButton imageUrl={variationImageUrl} />
          <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-black/60 backdrop-blur-sm p-2 pr-4 rounded-xl">
            <img
              src={originalImageUrl}
              alt="Original"
              className="w-12 h-12 rounded-lg object-cover cursor-pointer"
              onClick={() =>
                download({ setLoading, imageUrl: originalImageUrl })
              }
            />

            <span className="text-white text-sm font-medium">Original</span>
          </div>
        </div>
      </div>
    </div>
  );
}
