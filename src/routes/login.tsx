import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/app/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) setError(error.message);
  }

  useEffect(() => {
    if (user) navigate({ to: "/app" });
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            Inicie sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full cursor-pointer"
          >
            <FcGoogle />
            <p className="flex max-w-full font-bold p-10">
              Continuar com Google
            </p>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
