import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import SidebarButton from "./SidebarButton";

export default function Page() {
  const isMobile = useIsMobile();
  return (
    <div className="bg-transparent">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          {isMobile && (
            <header className="fixed flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="cursor-pointer flex items-center gap-2 px-4">
                <SidebarButton />
              </div>
            </header>
          )}
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
