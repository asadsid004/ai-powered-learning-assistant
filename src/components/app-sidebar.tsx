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
import Image from "next/image";
import Link from "next/link";

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
              <Link href="/dashboard">
                <Image src="/logo.svg" width={40} height={40} alt="logo" />
                <span className="text-xl font-semibold">Quest ai</span>
              </Link>
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
