"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import SearchBar from "@/components/search/SearchBar";

interface NavbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export default function Navbar({ onToggleSidebar, sidebarOpen }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        borderColor: "var(--border-primary)",
        background: "var(--bg-nav)",
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-lg cursor-pointer transition-colors"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
              style={{ background: "var(--gradient-brand)" }}
            >
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none" style={{ color: "var(--text-primary)" }}>
                SONiC Docs
              </span>
              <span className="text-[10px] leading-none mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                OpenConfig Annotations
              </span>
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link
            href="/docs/annotation-guide"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: "var(--bg-tertiary)", color: "var(--accent-purple)", border: "1px solid var(--border-primary)" }}
          >
            📝 Annotation Guide
          </Link>
          <SearchBar />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{
              color: "var(--text-secondary)",
              background: "transparent",
            }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <a
            href="https://github.com/sonic-net/sonic-buildimage"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
