"use client";

import * as React from "react";

import { useAuth } from "@/hooks/use-auth";

import {
  ChartPie,
  Mail,
  PackageCheck,
  PackageSearch,
  Truck,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  items: [
    {
      title: "Dashboard",
      url: "/",
      icon: ChartPie,
    },
    {
      title: "Envios em Andamento",
      url: "/shipments",
      icon: Truck,
    },
    {
      title: "Rastreamento",
      url: "/tracking",
      icon: PackageSearch,
    },
    {
      title: "Templates de Email",
      url: "/templates-email",
      icon: Mail,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userName, userEmail, userAvatar } = useAuth();

  const user = {
    name: userName,
    email: userEmail,
    avatar: userAvatar,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <PackageCheck className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Tracking</span>
              <span className="truncate text-xs">Omar Calçados</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent >
        <NavMain items={data.items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
