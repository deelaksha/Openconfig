"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { annotationGuideNav, GuideSection } from "@/lib/annotation-guide-data";

interface GuideSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function GuideSidebar({ isOpen = true, onClose }: GuideSidebarProps) {
  const [activeSlug, setActiveSlug] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      let current = "";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120) {
          current = section.getAttribute("data-section") || "";
        }
      });
      setActiveSlug(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed lg:sticky top-14 z-30 h-[calc(100vh-3.5rem)] w-64 
          border-r overflow-y-auto
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          borderColor: "var(--border-primary)",
          background: "var(--bg-sidebar)",
        }}
      >
        <nav className="py-6 px-3">
          <div className="text-[10px] uppercase font-bold tracking-widest px-3 mb-4" style={{ color: "var(--text-tertiary)" }}>
            Annotation Guide
          </div>
          {annotationGuideNav.map((section, i) => (
            <GuideSidebarItem key={section.slug} section={section} activeSlug={activeSlug} index={i} />
          ))}
        </nav>
      </aside>
    </>
  );
}

function GuideSidebarItem({ section, activeSlug, index }: { section: GuideSection; activeSlug: string; index: number }) {
  const isActive = activeSlug === section.slug;
  const hasChildren = section.children && section.children.length > 0;
  const childActive = section.children?.some(c => activeSlug === c.slug);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (childActive) setExpanded(true);
  }, [childActive]);

  return (
    <div className="mb-0.5">
      <a
        href={`#${section.slug}`}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
        }}
        className="flex items-center justify-between px-3 py-2 rounded-lg text-[12px] transition-all"
        style={{
          color: isActive || childActive ? "var(--accent-blue)" : "var(--text-secondary)",
          background: isActive ? "var(--bg-tertiary)" : "transparent",
          fontWeight: isActive || childActive ? 600 : 400,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold"
            style={{
              background: isActive || childActive ? "var(--accent-blue)" : "var(--bg-tertiary)",
              color: isActive || childActive ? "white" : "var(--text-tertiary)",
            }}
          >
            {index + 1}
          </span>
          <span className="leading-tight">{section.title}</span>
        </div>
        {hasChildren && (
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={12} style={{ color: "var(--text-tertiary)" }} />
          </motion.div>
        )}
      </a>

      {hasChildren && expanded && (
        <div className="ml-7 border-l pl-2 mt-0.5 mb-1" style={{ borderColor: "var(--border-primary)" }}>
          {section.children!.map((child) => {
            const isChildActive = activeSlug === child.slug;
            return (
              <a
                key={child.slug}
                href={`#${child.slug}`}
                className="block px-3 py-1.5 text-[11px] rounded-md transition-all"
                style={{
                  color: isChildActive ? "var(--accent-blue)" : "var(--text-tertiary)",
                  background: isChildActive ? "var(--bg-tertiary)" : "transparent",
                  fontWeight: isChildActive ? 600 : 400,
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
