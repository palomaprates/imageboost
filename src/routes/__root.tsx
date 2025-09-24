import * as React from "react";
import { createRootRoute } from "@tanstack/react-router";
import Page from "@/components/Page";

export const Route = createRootRoute({
  component: Page,
  context: () => {
    return {
      imageUrls: [] as string[],
      setImageUrls: (() => {}) as React.Dispatch<
        React.SetStateAction<string[]>
      >,
    };
  },
});
