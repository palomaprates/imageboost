import "./App.css";
import { RouterProvider, Router } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";
import { routeTree } from "./routeTree.gen";

const router = new Router({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="w-screen md:min-h-full h-dvh bg-gradient-to-r from-purple-200/50 via-purple-200 to-[#e8dbf6]/30">
            <RouterProvider router={router} />
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
