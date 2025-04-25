import React from 'react';
import {
    SidebarProvider
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/elements/app-sidebar";
import Header from './_components/header';

const DashboardLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <SidebarProvider>
        <AppSidebar />
        <main>
            <Header />
            {children}
        </main>
    </SidebarProvider>
  )
}

export default DashboardLayout;
