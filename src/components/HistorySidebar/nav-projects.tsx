import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHistory,
  HISTORY_KEY,
  type HistoryItem,
} from "../utils/fetchHistory";
import { AiOutlinePlusSquare } from "react-icons/ai";
import HistoryItemComponent from "./HistoryItemComponent";

export function NavProjects() {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

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

  async function handleGoToApp() {
    toggleSidebar();
    await new Promise((resolve) => setTimeout(resolve, 150));
    navigate({ to: "/app" });
  }
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex flex-col gap-2">
        <SidebarGroupLabel
          className="flex h-10 mt-4 items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer font-montserrat"
          onClick={handleGoToApp}
        >
          <AiOutlinePlusSquare /> <span>Nova imagem </span>
        </SidebarGroupLabel>
        <SidebarGroupLabel className="text-md font-montserrat text-gray-800 my-2">
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
