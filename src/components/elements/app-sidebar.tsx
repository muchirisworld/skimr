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
} from "@/components/ui/sidebar";
import { CameraIcon, GearIcon } from "@radix-ui/react-icons";
import { FolderOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import UserButton from "./user-button";


const items = [
    {
        name: "Explore",
        href: "/dashboard",
        icon: CameraIcon,
    },
    {
        name: "Search",
        href: "/dashboard/search",
        icon: MagnifyingGlassIcon,
    },
    {
        name: "Collections",
        href: "/dashboard/collections",
        icon: FolderOpenIcon,
    },
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: GearIcon,
    },
  ];

export function AppSidebar() {
  return (
    <Sidebar>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => (
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild>
                            <Link href={item.href}>
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
            <SidebarMenu>
                <SidebarMenuItem>
                    <UserButton />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
