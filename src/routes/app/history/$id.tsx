import DisplayImages from "@/components//ImageComponents/DisplayImages";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchImage } from "@/components/utils/fetchImage";

export const Route = createFileRoute("/app/history/$id")({
  component: HistoryRoute,
  validateSearch: (search: { url?: string }) => search,
});

function HistoryRoute() {
  const { id } = Route.useParams();

  const { data: generation, isLoading } = useQuery({
    queryKey: ["generation", id],
    queryFn: () => fetchImage(id),
    staleTime: Infinity,
  });

  if (isLoading) {
    return <span>...Loading</span>;
  }

  if (!generation) {
    return <span>error getting images</span>;
  }

  return (
    <div className="my-auto mx-auto ">
      <DisplayImages
        originalImageUrl={generation.image_url}
        variationImageUrl={generation.variation_url}
      />
      <div className="w-full text-center select-none flex flex-col items-center justify-center">
        <p className="font-montserrat text-4xl text-black mb-3">
          Imagem otimizada
        </p>
        <p className="font-montserrat text-xl text-gray-600">
          Clique para fazer o download.
        </p>
      </div>
    </div>
  );
}
