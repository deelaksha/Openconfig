"use client";

import React, { useState } from "react";
import GuideSidebar from "@/components/sidebar/GuideSidebar";

export default function AnnotationGuideLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <GuideSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="prose">
          {children}
        </div>
      </main>
    </div>
  );
}
