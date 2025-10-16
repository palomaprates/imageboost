import Page from "@/components/PageComponents/Page";
import { useAuth } from "@/context/AuthContext";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/app")({
  component: () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    console.log("loading:", loading, "user:", user);
    useEffect(() => {
      if (!user && !loading) {
        navigate({ to: "/" });
      }
    }, [user, loading]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin text-gray-500" size={48} />
        </div>
      );
    }
    return <Page />;
  },
  notFoundComponent: () => <Navigate to="/app" />,
});
