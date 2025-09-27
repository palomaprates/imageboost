import ImageEditor from "@/components/ImageEditor";
import Slogan from "@/components/Slogan";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full px-12 max-w-[700px] mx-auto my-auto">
      <Slogan />
      <ImageEditor />
    </div>
  );
}
