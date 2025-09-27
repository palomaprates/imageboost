import ImageEditor from "@/components/ImageEditor";
import Slogan from "@/components/Slogan";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center min-h-dvh w-full mx-auto px-7 sm:px-12 max-w-[700px] overflow-y-auto!">
      <div className="flex flex-col items-center justify-center w-full mx-auto">
        <Slogan />
        <ImageEditor />
      </div>
    </div>
  );
}
