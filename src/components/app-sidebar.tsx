"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  BarChart3,
  Camera,
  Users,
  Newspaper,
  LayoutDashboard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const sections = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Instagram Manager", url: "/instagram", icon: Camera },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Content Calendar", url: "/calendar", icon: CalendarDays },
  { title: "Competitor Tracker", url: "/competitors", icon: Users },
  { title: "News Consolidator", url: "/news", icon: Newspaper },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-amber-300/70 to-amber-600/50 flex items-center justify-center">
            <LayoutDashboard className="h-3.5 w-3.5 text-amber-950" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">
            <span className="golden-text">Content</span> Dashboard
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section) => (
                <SidebarMenuItem key={section.url}>
                  <SidebarMenuButton asChild isActive={pathname === section.url}>
                    <Link href={section.url}>
                      <section.icon className="h-4 w-4" />
                      <span>{section.title}</span>
                    </Link>
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
