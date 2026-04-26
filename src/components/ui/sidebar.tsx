"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = "16rem";

const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: true,
  setOpen: () => {},
});

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  return React.useContext(SidebarContext);
}

function Sidebar({ className, ...props }: React.ComponentProps<"aside">) {
  const { open } = useSidebar();
  return (
    <aside
      data-state={open ? "open" : "collapsed"}
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl text-sidebar-foreground transition-all duration-200",
        open ? `w-[${SIDEBAR_WIDTH}]` : "w-14",
        className
      )}
      style={{ width: open ? SIDEBAR_WIDTH : "3.5rem" }}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center border-b border-sidebar-border/50", className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-1 flex-col overflow-auto", className)}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1 p-2", className)} {...props} />;
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { open } = useSidebar();
  if (!open) return null;
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col gap-0.5", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("", className)} {...props} />;
}

function SidebarMenuButton({
  className,
  asChild,
  isActive,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  const { open } = useSidebar();
  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive &&
          "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        !open && "justify-center px-0",
        className
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
};
