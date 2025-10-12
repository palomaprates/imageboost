import ImageEditor from "@/components/ImageEditor";
import ImageEditorTitle from "@/components/ImageEditorTitle";
import { useAuth } from "@/context/AuthContext";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/editImage")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();
  if (loading) return <p>Carregando...</p>;
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="flex items-center justify-center w-full mx-auto my-auto px-7 sm:px-12 max-w-[700px]">
      <div className="flex flex-col items-center justify-center w-full mx-auto my-auto">
        <ImageEditorTitle />
        <ImageEditor />
      </div>
    </div>
  );
}
