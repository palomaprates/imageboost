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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchHistory,
  HISTORY_KEY,
  type HistoryItem,
} from "./utils/fetchHistory";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { deleteHistoryItem } from "./utils/deleteHistoryItem";

export function NavProjects() {
  const queryClient = useQueryClient();
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
  async function handleDelete(id: number) {
    try {
      await deleteHistoryItem(id);
      await queryClient.invalidateQueries({ queryKey: [HISTORY_KEY] });
    } catch (error) {
      console.error("Erro ao deletar", error);
    }
  }
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex flex-col gap-2">
        <SidebarGroupLabel>
          <Link
            to="/"
            className="flex gap-1 items-center cursor-pointer font-montserrat text-xs mt-1"
          >
            <AiOutlinePlusSquare className="text-lg" /> Nova imagem
          </Link>
        </SidebarGroupLabel>
        <SidebarGroupLabel className="text-xs font-montserrat text-gray-800 mb-2">
          Histórico
        </SidebarGroupLabel>
      </div>
      <SidebarMenu>
        {Array.isArray(history) &&
          history.map((item) => (
            <SidebarMenuItem key={item.id} className="space-y-3">
              <Link
                key={item.id}
                to="/history/$id"
                params={{ id: String(item.id) }}
              >
                <SidebarMenuButton className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <img
                    src={item.image_url || "fallback.png"}
                    className="w-7 h-7 rounded-md object-cover"
                    alt="thumbnail"
                  />
                  <span className="text-gray-500 font-montserrat text-xs">
                    Histórico
                  </span>
                </SidebarMenuButton>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="text-gray-600">
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
                  <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                    <Trash2 className="text-muted-foreground cursor-pointer" />
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
