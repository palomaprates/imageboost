import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ImageCompare from "@/components/ImageComponents/ImageCompare";
import Slogan from "@/components/PageComponents/Slogan";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate({ to: "/login" });
  };

  return (
    <div className="flex items-center justify-center w-full mx-auto my-auto px-7 sm:px-12 max-w-[700px] h-screen">
      <div className="flex flex-col items-center justify-center w-full mx-auto my-auto">
        <Slogan />
        <ImageCompare />
        <button
          onClick={handleNavigate}
          className="my-8 w-full bg-purple-800 hover:bg-purple-900 text-white
                     font-montserrat text-l rounded-xl px-4 sm:px-6 py-3 shadow-md transition cursor-pointer text-sm"
        >
          Editar Imagem
        </button>
      </div>
    </div>
  );
}
