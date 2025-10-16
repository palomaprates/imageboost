import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SidebarButton from "../HistorySidebar/SidebarButton";
import Header from "./Header";
import { AppSidebar } from "../HistorySidebar/app-sidebar";
import { Outlet } from "@tanstack/react-router";

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
