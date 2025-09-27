import Logo from "./Logo";
import { useSidebar } from "./ui/sidebar";

export default function SidebarButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <div onClick={toggleSidebar}>
      <Logo />
    </div>
  );
}
