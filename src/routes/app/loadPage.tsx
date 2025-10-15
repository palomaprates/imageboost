import LoadingPage from "@/components/loading";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/loadPage")({
  component: LoadingPage,
});
