import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHistory,
  HISTORY_KEY,
  type HistoryItem,
} from "../utils/fetchHistory";
import { AiOutlinePlusSquare } from "react-icons/ai";
import HistoryItemComponent from "./HistoryItemComponent";

export function NavProjects() {
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
      <div className="flex flex-col gap-2">
        <SidebarGroupLabel className="flex h-10 items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer font-montserrat">
          <Link to="/app" className="flex gap-1">
            <AiOutlinePlusSquare className="text-lg " /> Nova imagem
          </Link>
        </SidebarGroupLabel>
        <SidebarGroupLabel className="text-xs font-montserrat text-gray-800 mb-2">
          Histórico
        </SidebarGroupLabel>
      </div>
      <SidebarMenu>
        {Array.isArray(history) &&
          history.map((item) => (
            <HistoryItemComponent item={item} key={item.id} />
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
