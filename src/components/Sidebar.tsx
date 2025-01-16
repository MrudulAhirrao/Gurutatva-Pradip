'use client'

import * as React from "react";
import { useState } from "react";
import { SearchForm } from "./Search";
import {  GalleryVerticalEnd, LayoutDashboard, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const data = {
  menu: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icons: <LayoutDashboard />,
    },
    {
      title: "General",
      items: [
        {
          title: "Users",
          icons:<Users/>,
          url: "/users",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [filteredMenu, setFilteredMenu] = useState(data.menu);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredMenu(data.menu);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = data.menu.map((menu: { title: string; items?: { title: string; url: string }[] }) => {
        const filteredItems = menu.items?.filter((item) =>
          item.title.toLowerCase().includes(lowercasedQuery)
        );
        if (menu.title.toLowerCase().includes(lowercasedQuery) || filteredItems?.length) {
          return {
            ...menu,
            items: filteredItems,
          };
        }
        return null;
      }).filter((menu): menu is { title: string; items: { title: string; url: string }[] | undefined } => Boolean(menu));
      setFilteredMenu(filtered as typeof data.menu);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar variant="floating" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Gurutatva Pradip</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SearchForm onSearch={handleSearch} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              {filteredMenu.map((menu: { title: string; url?: string; items?: { title: string; url: string; isActive?: boolean; icons?: React.ReactNode }[]; icons?: React.ReactNode }, key: number) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton asChild>
                    <a href={menu.url} className="font-medium">
                      {menu.icons}
                      {menu.title}
                    </a>
                  </SidebarMenuButton>
                  {menu.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                      {menu.items.map((subItem: { title: string; url: string; isActive?: boolean; icons?: React.ReactNode }) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                            <a href={subItem.url}>{subItem.icons}{subItem.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
