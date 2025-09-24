import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ImageEditor from "./ImageEditor";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Outlet } from "@tanstack/react-router";

export default function Page() {
  const [history, setHistory] = useState<
    { id: number; description: string; image: string }[]
  >([]);

  async function fetchHistory() {
    const { data, error } = await supabase
      .from("images")
      .select("id, image_url")
      .order("created_at", { ascending: false });
    if (data) {
      setHistory(
        data.map((item) => ({
          id: item.id,
          description: `Histórico`,
          image: item.image_url,
        }))
      );
    }
  }
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <SidebarProvider>
      <>
        <AppSidebar history={history} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">ImageBoost</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Editar sua imagem</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3"></div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
              <ImageEditor />
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </>
    </SidebarProvider>
  );
}
