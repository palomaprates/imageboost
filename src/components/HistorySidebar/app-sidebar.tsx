"use client";
import * as React from "react";
import { NavProjects } from "@/components/HistorySidebar/nav-projects";
import { NavUser } from "@/components/HistorySidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface AppSidebarProps
  extends React.ComponentPropsWithoutRef<typeof Sidebar> {}

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
