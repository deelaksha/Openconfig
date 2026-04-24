"use client";

import React from "react";
import Navbar from "@/components/navbar/Navbar";
import { SidebarProvider } from "@/lib/sidebar-context";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <Navbar />
        {children}
      </div>
    </SidebarProvider>
  );
}
