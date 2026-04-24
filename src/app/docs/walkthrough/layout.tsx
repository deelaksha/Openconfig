"use client";
import React from "react";
import WalkthroughSidebar from "@/components/sidebar/WalkthroughSidebar";

export default function WalkthroughLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <WalkthroughSidebar />
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto prose">
          {children}
        </div>
      </main>
    </div>
  );
}
