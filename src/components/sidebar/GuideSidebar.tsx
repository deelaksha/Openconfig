"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Home } from "lucide-react";
import { annotationGuideNav, GUIDE_BASE, GuideSection } from "@/lib/annotation-guide-data";
import { useSidebar } from "@/lib/sidebar-context";

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  "Start here": { bg: "#3b82f615", text: "#3b82f6" },
  Foundation:   { bg: "#8b5cf615", text: "#8b5cf6" },
  Simplest:     { bg: "#10b98115", text: "#10b981" },
  Advanced:     { bg: "#ef444415", text: "#ef4444" },
  Reference:    { bg: "#f59e0b15", text: "#f59e0b" },
};

export default function GuideSidebar() {
  const { isOpen, close, collapsed, toggleCollapsed } = useSidebar();
  const pathname = usePathname();

  const getHref = (section: GuideSection) =>
    section.slug === "" ? GUIDE_BASE : `${GUIDE_BASE}/${section.slug}`;

  const isActive = (section: GuideSection) => {
    const href = getHref(section);
    if (section.slug === "") return pathname === GUIDE_BASE;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* ── Mobile backdrop ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30"
            style={{ background: "rgba(0,0,0,0.55)" }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar panel ── */}
      <motion.aside
        animate={{ width: collapsed ? 0 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`
          hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)]
          border-r overflow-hidden shrink-0
        `}
        style={{
          borderColor: "var(--border-primary)",
          background: "var(--bg-sidebar)",
        }}
      >
        <SidebarContent
          pathname={pathname}
          getHref={getHref}
          isActive={isActive}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
        />
      </motion.aside>

      {/* ── Mobile drawer ── */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.28, ease: "easeInOut" }}
        className="lg:hidden fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 border-r overflow-hidden"
        style={{
          borderColor: "var(--border-primary)",
          background: "var(--bg-sidebar)",
        }}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border-primary)" }}>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Annotation Guide
          </span>
          <button
            onClick={close}
            className="p-1 rounded-md"
            style={{ color: "var(--text-secondary)" }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-16">
          <NavList pathname={pathname} getHref={getHref} isActive={isActive} />
        </div>
      </motion.aside>

      {/* ── Desktop collapse toggle tab ── */}
      <div className="hidden lg:block">
        <button
          onClick={toggleCollapsed}
          className="fixed top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-5 h-12 rounded-r-lg border border-l-0 cursor-pointer transition-all hover:w-6"
          style={{
            left: collapsed ? 0 : 256,
            borderColor: "var(--border-primary)",
            background: "var(--bg-sidebar)",
            color: "var(--text-tertiary)",
            transition: "left 0.25s ease-in-out",
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>
    </>
  );
}

function SidebarContent({
  pathname,
  getHref,
  isActive,
  collapsed,
  onToggleCollapsed,
}: {
  pathname: string;
  getHref: (s: GuideSection) => string;
  isActive: (s: GuideSection) => boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <div className="w-64 h-full overflow-y-auto">
      <div className="px-3 py-4">
        <div className="text-[10px] uppercase font-bold tracking-widest px-3 mb-3" style={{ color: "var(--text-tertiary)" }}>
          Annotation Guide
        </div>
        <NavList pathname={pathname} getHref={getHref} isActive={isActive} />
      </div>
    </div>
  );
}

function NavList({
  pathname,
  getHref,
  isActive,
}: {
  pathname: string;
  getHref: (s: GuideSection) => string;
  isActive: (s: GuideSection) => boolean;
}) {
  return (
    <nav className="space-y-0.5 px-2">
      {annotationGuideNav.map((section, i) => {
        const active = isActive(section);
        const href = getHref(section);
        const badge = section.badge ? BADGE_COLORS[section.badge] : null;

        return (
          <Link
            key={section.slug}
            href={href}
            className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-[12.5px] transition-all group"
            style={{
              color: active ? "var(--accent-blue)" : "var(--text-secondary)",
              background: active ? "rgba(59,130,246,0.08)" : "transparent",
              fontWeight: active ? 600 : 400,
              borderLeft: active ? "2px solid var(--accent-blue)" : "2px solid transparent",
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0"
                style={{
                  background: active ? "var(--accent-blue)" : "var(--bg-tertiary)",
                  color: active ? "white" : "var(--text-tertiary)",
                }}
              >
                {section.slug === "" ? <Home size={10} /> : i}
              </span>
              <span className="truncate leading-tight">{section.title}</span>
            </div>
            {badge && (
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                style={{ background: badge.bg, color: badge.text }}
              >
                {section.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
