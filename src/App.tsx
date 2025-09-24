import "./App.css";
import { RouterProvider, Router } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = new Router({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
function App() {
  return (
    <>
      <div className="w-screen h-screen">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
