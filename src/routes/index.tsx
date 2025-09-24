import ImageEditor from "@/components/ImageEditor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ImageEditor />
    </div>
  );
}
