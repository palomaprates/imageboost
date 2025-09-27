"use client";

import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHistory,
  HISTORY_KEY,
  type HistoryItem,
} from "./utils/fetchHistory";
import { AiOutlinePlusSquare } from "react-icons/ai";

export function NavProjects() {
  const { isMobile } = useSidebar();

  const { data: history = [], isLoading } = useQuery<HistoryItem[]>({
    queryKey: [HISTORY_KEY],
    queryFn: () => fetchHistory(),
    staleTime: Infinity,
  });

  if (isLoading) {
    return <span>...Loading</span>;
  }

  if (!history) {
    return <span>error getting images</span>;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <Link to="/" className="flex gap-1 items-center cursor-pointer">
          <AiOutlinePlusSquare /> Editar nova imagem
        </Link>
      </SidebarGroupLabel>
      <SidebarGroupLabel>Histórico</SidebarGroupLabel>
      <SidebarMenu>
        {Array.isArray(history) &&
          history.map((item) => (
            <SidebarMenuItem key={item.id}>
              <Link
                key={item.id}
                to="/history/$id"
                params={{ id: String(item.id) }}
              >
                <SidebarMenuButton>
                  <img
                    src={item.image_url || "fallback.png"}
                    width={30}
                    height={30}
                    alt="thumbnail"
                  />
                  <span className="font-light">Histórico</span>
                </SidebarMenuButton>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "right" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70"></SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
