import ImageEditor from "@/components/ImageEditor";
import ImageEditorTitle from "@/components/ImageEditorTitle";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center w-full mx-auto my-auto px-7 sm:px-12 max-w-[700px]">
      <div className="flex flex-col items-center justify-center w-full mx-auto my-auto">
        <ImageEditorTitle />
        <ImageEditor />
      </div>
    </div>
  );
}
