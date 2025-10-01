import { useRef } from "react";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { Link } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { TbPencil } from "react-icons/tb";
import { deleteHistoryItem } from "./utils/deleteHistoryItem";
import { useQueryClient } from "@tanstack/react-query";
import { HISTORY_KEY, type HistoryItem } from "./utils/fetchHistory";
import { updateDescription } from "./utils/updateDescription";

export default function HistoryItemComponent({ item }: { item: HistoryItem }) {
  const queryClient = useQueryClient();
  const spanRef = useRef<HTMLSpanElement>(null);
  const { isMobile } = useSidebar();

  const handleSave = async () => {
    if (!spanRef.current) return;
    const newValue = spanRef.current.innerText.trim();

    if (newValue !== item.description) {
      try {
        await updateDescription(item.id, newValue);
        await queryClient.invalidateQueries({ queryKey: [HISTORY_KEY] });
      } catch (err) {
        console.error("falha ao salvar:", err);
      }
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      spanRef.current?.blur();
      handleSave();
    }
  };
  async function handleDelete(id: number) {
    try {
      await deleteHistoryItem(id);
      await queryClient.invalidateQueries({ queryKey: [HISTORY_KEY] });
    } catch (error) {
      console.error("Erro ao deletar", error);
    }
  }
  return (
    <SidebarMenuItem key={item.id} className="space-y-3">
      <Link key={item.id} to="/history/$id" params={{ id: String(item.id) }}>
        <SidebarMenuButton className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
          <img
            src={item.image_url || "fallback.png"}
            className="w-7 h-7 rounded-md object-cover"
            alt="thumbnail"
          />
          <span
            contentEditable
            suppressContentEditableWarning
            ref={spanRef}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="font-montserrat text-xs"
          >
            {item.description}
          </span>
        </SidebarMenuButton>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="text-gray-600 cursor-pointer">
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={isMobile ? "right" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              // console.log("focado");
              setTimeout(() => {
                if (!spanRef.current) return;
                spanRef.current.focus();
              }, 300);
            }}
          >
            <TbPencil className="text-muted-foreground" />{" "}
            <span className="text-muted-foreground text-xs">Renomear</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className=" text-red-600" />
            <span className="text-red-600 text-xs">Excluir</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
