"use client";

import React from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { MoreVerticalIcon, LogOutIcon } from 'lucide-react';
import {  } from "@radix-ui/react-icons";
import { CreditCardIcon, UserCircleIcon, BellIcon } from "@heroicons/react/24/outline";
import { SignOutButton, useUser } from '@clerk/nextjs';

const UserButton = () => {
    const { user } = useUser();
    const { isMobile } = useSidebar();
    
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName!} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.fullName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                        {user?.emailAddresses[0].emailAddress}
                    </span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
        >
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName!} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user?.fullName}</span>
                        <span className="truncate text-xs text-muted-foreground">
                            {user?.emailAddresses[0].emailAddress}
                        </span>
                    </div>
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
                <DropdownMenuItem>
                    <UserCircleIcon />
                    Account
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <CreditCardIcon />
                    Billing
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <BellIcon />
                    Notifications
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            
            <SignOutButton>
                <DropdownMenuItem>
                    <LogOutIcon />
                    Log out
                </DropdownMenuItem>
            </SignOutButton>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton;
