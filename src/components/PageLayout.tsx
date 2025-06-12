
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageLayout = ({ title, children }: PageLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-3 md:p-6 bg-gray-50">
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <SidebarTrigger />
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PageLayout;
