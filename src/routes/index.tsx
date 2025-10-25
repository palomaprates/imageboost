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
    <div className="flex items-center justify-center mx-auto my-auto px-7 sm:px-12 h-screen">
      <div className="flex flex-col items-center justify-center mx-auto my-auto">
        <Slogan />
        <ImageCompare />
        <button
          onClick={handleNavigate}
          className="my-8 md:w-[500px] w-full bg-orange-500 hover:bg-orange-600 text-white
                     font-montserrat rounded-xl px-4 py-3 shadow-md transition cursor-pointer text-md mx-auto"
        >
          Editar Imagem
        </button>
      </div>
    </div>
  );
}
