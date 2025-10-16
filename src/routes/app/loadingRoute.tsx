import LoadingPage from "@/components/Loading";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/loadingRoute")({
  component: LoadingPage,
});
