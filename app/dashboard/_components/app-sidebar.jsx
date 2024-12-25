'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { GraduationCap, Hand, LayoutIcon, Settings2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    id: 1,
    name: "Dashboard",
    icon: LayoutIcon,
    link: "/dashboard",
  },
  {
    id: 2,
    name: "Students",
    icon: GraduationCap,
    link: "/dashboard/students",
  },
  {
    id: 3,
    name: "Attendance",
    icon: Hand,
    link: "/dashboard/attendance",
  },
  {
    id: 4,
    name: "Settings",
    icon: Settings2,
    link: "/dashboard/settings",
  },
];

export function AppSidebar() {
  const { user } = useKindeBrowserClient();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link href={item.link}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="mt-auto flex gap-2 items-center p-4 border-t border-gray-200">
          {user?.picture && (
            <Image
              src={user.picture}
              className="rounded-full"
              alt="User Picture"
              width={40}
              height={40}
            />
          )}
          <div>
            <p className="text-gray-700 font-medium truncate">{user?.name}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
      