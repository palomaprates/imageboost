import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import SidebarButton from "./SidebarButton";
import Header from "./Header";
import { AppSidebar } from "./app-sidebar";

export default function Page() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-transparent min-h-full">
          <div className="cursor-pointer flex items-center px-4 justify-center">
            <SidebarButton />
            <Header />
          </div>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
