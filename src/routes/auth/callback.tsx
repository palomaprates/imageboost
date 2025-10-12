import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/services/supabaseClient";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        navigate({ to: "/editImage" });
      } else {
        navigate({ to: "/login" });
      }
    };
    handleSession();
  }, [navigate]);

  return <p>Carregando...</p>;
}
