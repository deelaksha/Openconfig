"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { docsNavigation, DocSection } from "@/lib/docs-data";
import { useSidebar } from "@/lib/sidebar-context";

export default function Sidebar() {
  const { isOpen, close, collapsed, toggleCollapsed } = useSidebar();
  const [activeSlug, setActiveSlug] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      let current = "";
      sections.forEach((el) => {
        if (el.getBoundingClientRect().top <= 120)
          current = el.getAttribute("data-section") || "";
      });
      setActiveSlug(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* ── Desktop sidebar (collapsible) ── */}
      <motion.aside
        animate={{ width: collapsed ? 0 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] border-r overflow-hidden shrink-0"
        style={{
          borderColor: "var(--border-primary)",
          background: "var(--bg-sidebar)",
        }}
      >
        <div className="w-60 h-full overflow-y-auto">
          <nav className="py-5 px-3">
            <div className="text-[10px] uppercase font-bold tracking-widest px-3 mb-4" style={{ color: "var(--text-tertiary)" }}>
              Interface Flow
            </div>
            <NavItems activeSlug={activeSlug} />
          </nav>
        </div>
      </motion.aside>

      {/* ── Mobile drawer ── */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.28, ease: "easeInOut" }}
        className="lg:hidden fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-60 border-r overflow-hidden"
        style={{
          borderColor: "var(--border-primary)",
          background: "var(--bg-sidebar)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border-primary)" }}>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Interface Flow
          </span>
          <button onClick={close} className="p-1 rounded-md" style={{ color: "var(--text-secondary)" }}>
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-16 px-3 py-3">
          <NavItems activeSlug={activeSlug} />
        </div>
      </motion.aside>

      {/* ── Desktop collapse tab ── */}
      <button
        onClick={toggleCollapsed}
        className="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 items-center justify-center w-5 h-12 rounded-r-lg border border-l-0 cursor-pointer transition-all hover:w-6"
        style={{
          left: collapsed ? 0 : 240,
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

function NavItems({ activeSlug }: { activeSlug: string }) {
  return (
    <div className="space-y-0.5">
      {docsNavigation.map((section, i) => (
        <NavItem key={section.slug} section={section} activeSlug={activeSlug} index={i} />
      ))}
    </div>
  );
}

function NavItem({ section, activeSlug, index }: { section: DocSection; activeSlug: string; index: number }) {
  const isActive = activeSlug === section.slug;
  const childActive = section.children?.some((c) => activeSlug === c.slug);
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <a
        href={`#${section.slug}`}
        onClick={() => section.children && setExpanded(!expanded)}
        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[12.5px] transition-all"
        style={{
          color: isActive || childActive ? "var(--accent-blue)" : "var(--text-secondary)",
          background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
          fontWeight: isActive || childActive ? 600 : 400,
          borderLeft: isActive ? "2px solid var(--accent-blue)" : "2px solid transparent",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0"
            style={{
              background: isActive || childActive ? "var(--accent-blue)" : "var(--bg-tertiary)",
              color: isActive || childActive ? "white" : "var(--text-tertiary)",
            }}
          >
            {index + 1}
          </span>
          <span className="leading-tight">{section.title}</span>
        </div>
        {section.children && (
          <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={12} style={{ color: "var(--text-tertiary)" }} />
          </motion.span>
        )}
      </a>

      {section.children && expanded && (
        <div className="ml-7 border-l pl-2 mt-0.5 mb-1 space-y-0.5" style={{ borderColor: "var(--border-primary)" }}>
          {section.children.map((child) => {
            const ca = activeSlug === child.slug;
            return (
              <a
                key={child.slug}
                href={`#${child.slug}`}
                className="block px-3 py-1.5 text-[11.5px] rounded-md transition-all"
                style={{
                  color: ca ? "var(--accent-blue)" : "var(--text-tertiary)",
                  background: ca ? "rgba(59,130,246,0.07)" : "transparent",
                  fontWeight: ca ? 600 : 400,
                }}
              >
                {child.title}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
