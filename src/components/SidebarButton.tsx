import { LuMenu } from "react-icons/lu";
import { useSidebar } from "./ui/sidebar";

export default function SidebarButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <div onClick={toggleSidebar}>
      <LuMenu className="w-6 h-6 hover:text-purple-900 transition duration-300" />
    </div>
  );
}
