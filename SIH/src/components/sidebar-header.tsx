"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function SidebarHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-sm px-6 sticky top-0 z-30">
      <SidebarTrigger />
      <div className="flex-1">
        {/* Can add breadcrumbs or page title here */}
      </div>
    </header>
  );
}
