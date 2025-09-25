import DisplayImages from "@/components/DisplayImages";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchImage } from "@/components/Generation";

export const Route = createFileRoute("/history/$id")({
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
    <div>
      <DisplayImages
        imageUrls={[generation.image_url, ...generation.variations_url]}
      />
    </div>
  );
}
