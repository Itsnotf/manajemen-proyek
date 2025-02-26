'use client'

import { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Folder,
  Home,
  Package,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home, 
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Folder, 
  },
  {
    title: "Bill",
    url: "/bills",
    icon: FileText, 
  },
  {
    title: "Material",
    url: "/materials",
    icon: Package,
  },
  {
    title: "Purchase",
    url: "/purchaseOrder",
    icon: FileSpreadsheet, 
  },
];

export function AppSidebar() {
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("users") || "{}";
    const userData = JSON.parse(userString);
    setRoleId(userData.role_id);
  }, []);

  const filteredItems = items.filter((item) => {
    if (roleId === 1) return true; // Semua menu muncul
    if (roleId === 2) return ["Dashboard", "Bill", "Material", "Purchase"].includes(item.title);
    if (roleId === 3) return ["Dashboard", "Projects"].includes(item.title);
    if (roleId === 4) return ["Projects", "Bill"].includes(item.title);
    return false;
  });

  return (
    <Sidebar title="Menu">
      <SidebarHeader className="text-center mt-10">LOGO</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
