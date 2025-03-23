"use client";

import * as React from "react";
import {
  IconAdjustmentsQuestion,
  IconBrain,
  IconCards,
  IconFileText,
  IconInnerShadowTop,
  IconLayout,
  IconSitemap,
  IconVocabulary,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayout,
    },
    {
      title: "Journey",
      url: "/journey",
      icon: IconSitemap,
    },
    {
      title: "Quiz",
      url: "/quiz",
      icon: IconBrain,
    },
    {
      title: "Flashcard",
      url: "/flashcard",
      icon: IconCards,
    },
    {
      title: "Chat PDF",
      url: "/chatpdf",
      icon: IconFileText,
    },
    {
      title: "Notes",
      url: "/notes",
      icon: IconVocabulary,
    },
    {
      title: "Ask AI",
      url: "/askai",
      icon: IconAdjustmentsQuestion,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-6" />
                <span className="text-xl font-semibold">Quest ai</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
