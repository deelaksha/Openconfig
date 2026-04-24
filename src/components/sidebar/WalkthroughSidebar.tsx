"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown, X, Home } from "lucide-react";
import { walkthroughNav, WALKTHROUGH_BASE, WalkthroughSection } from "@/lib/walkthrough-data";
import { useSidebar } from "@/lib/sidebar-context";

export default function WalkthroughSidebar() {
  const { isOpen, close, collapsed, toggleCollapsed } = useSidebar();
  const pathname = usePathname();

  const getHref = (section: WalkthroughSection) =>
    section.slug === "" ? WALKTHROUGH_BASE : `${WALKTHROUGH_BASE}/${section.slug}`;

  const isActive = (section: WalkthroughSection) => {
    const href = getHref(section);
    if (section.slug === "") return pathname === WALKTHROUGH_BASE;
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

      {/* ── Desktop sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 0 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] border-r overflow-hidden shrink-0"
        style={{ borderColor: "var(--border-primary)", background: "var(--bg-sidebar)" }}
      >
        <div className="w-64 h-full overflow-y-auto">
          <div className="px-3 py-4">
            <div className="text-[10px] uppercase font-bold tracking-widest px-3 mb-3" style={{ color: "var(--text-tertiary)" }}>
              Walkthrough
            </div>
            <NavList pathname={pathname} getHref={getHref} isActive={isActive} />
          </div>
        </div>
      </motion.aside>

      {/* ── Mobile drawer ── */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.28, ease: "easeInOut" }}
        className="lg:hidden fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 border-r overflow-hidden"
        style={{ borderColor: "var(--border-primary)", background: "var(--bg-sidebar)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border-primary)" }}>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Walkthrough
          </span>
          <button onClick={close} className="p-1 rounded-md" style={{ color: "var(--text-secondary)" }}>
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-16">
          <div className="px-2 py-3">
            <NavList pathname={pathname} getHref={getHref} isActive={isActive} />
          </div>
        </div>
      </motion.aside>

      {/* ── Desktop collapse tab ── */}
      <button
        onClick={toggleCollapsed}
        className="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 items-center justify-center w-5 h-12 rounded-r-lg border border-l-0 cursor-pointer hover:w-6 transition-all"
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
    </>
  );
}

function NavList({
  pathname,
  getHref,
  isActive,
}: {
  pathname: string;
  getHref: (s: WalkthroughSection) => string;
  isActive: (s: WalkthroughSection) => boolean;
}) {
  return (
    <nav className="space-y-0.5 px-1">
      {walkthroughNav.map((section, i) => (
        <NavItem key={section.slug} section={section} index={i} pathname={pathname} getHref={getHref} isActive={isActive} />
      ))}
    </nav>
  );
}

function NavItem({
  section,
  index,
  pathname,
  getHref,
  isActive,
}: {
  section: WalkthroughSection;
  index: number;
  pathname: string;
  getHref: (s: WalkthroughSection) => string;
  isActive: (s: WalkthroughSection) => boolean;
}) {
  const active = isActive(section);
  const childActive = section.children?.some((c) => pathname.includes(c.slug));
  const [expanded, setExpanded] = useState(childActive || active);
  const href = getHref(section);

  useEffect(() => {
    if (childActive || active) setExpanded(true);
  }, [childActive, active]);

  const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
    Start:      { bg: "#3b82f615", text: "#3b82f6" },
    "Deep dive": { bg: "#ef444415", text: "#ef4444" },
  };
  const badge = section.badge ? BADGE_COLORS[section.badge] : null;

  return (
    <div>
      <div className="flex items-center gap-1">
        <Link
          href={href}
          className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] transition-all"
          style={{
            color: active || childActive ? "var(--accent-blue)" : "var(--text-secondary)",
            background: active ? "rgba(59,130,246,0.08)" : "transparent",
            fontWeight: active || childActive ? 600 : 400,
            borderLeft: active ? "2px solid var(--accent-blue)" : "2px solid transparent",
          }}
        >
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0"
            style={{
              background: active || childActive ? "var(--accent-blue)" : "var(--bg-tertiary)",
              color: active || childActive ? "white" : "var(--text-tertiary)",
            }}
          >
            {section.slug === "" ? <Home size={10} /> : index}
          </span>
          <span className="truncate leading-tight">{section.title}</span>
          {badge && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0 ml-auto" style={{ background: badge.bg, color: badge.text }}>
              {section.badge}
            </span>
          )}
        </Link>
        {section.children && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-md shrink-0"
            style={{ color: "var(--text-tertiary)" }}
          >
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={12} />
            </motion.span>
          </button>
        )}
      </div>

      {section.children && expanded && (
        <div className="ml-7 border-l pl-2 mt-0.5 mb-1 space-y-0.5" style={{ borderColor: "var(--border-primary)" }}>
          {section.children.map((child) => {
            const childHref = `${WALKTHROUGH_BASE}/${child.slug}`;
            const ca = pathname === childHref || pathname.startsWith(childHref + "/");
            return (
              <Link
                key={child.slug}
                href={childHref}
                className="block px-3 py-1.5 text-[11.5px] rounded-md transition-all"
                style={{
                  color: ca ? "var(--accent-blue)" : "var(--text-tertiary)",
                  background: ca ? "rgba(59,130,246,0.07)" : "transparent",
                  fontWeight: ca ? 600 : 400,
                  borderLeft: ca ? "2px solid var(--accent-blue)" : "2px solid transparent",
                }}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
