
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <header className="h-16 border-b bg-white/80 backdrop-blur-sm flex items-center px-6 sticky top-0 z-40">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex items-center gap-4 ml-4 lg:ml-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-fresh rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🛒</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  Smart Shopping
                </h1>
              </div>
            </div>
          </header>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
