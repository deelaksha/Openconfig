"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Command } from "lucide-react";
import { searchableItems, SearchableItem } from "@/lib/docs-data";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchableItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(0);
    if (!value.trim()) {
      setResults([]);
      return;
    }

    const lower = value.toLowerCase();
    const filtered = searchableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.keywords.some((k) => k.includes(lower))
    );
    setResults(filtered);
  }, []);

  const navigateTo = useCallback(
    (item: SearchableItem) => {
      const path = item.parentSlug
        ? `/docs/${item.parentSlug}#${item.slug}`
        : `/docs/${item.slug}`;
      router.push(path);
      setOpen(false);
      setQuery("");
      setResults([]);
    },
    [router]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        setResults([]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Keyboard navigation within results
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigateTo(results[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex, navigateTo]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all cursor-pointer hover:border-[var(--accent-blue)]"
        style={{
          borderColor: "var(--border-primary)",
          background: "var(--bg-secondary)",
          color: "var(--text-tertiary)",
        }}
      >
        <Search size={14} />
        <span className="hidden sm:inline">Search docs...</span>
        <div className="hidden sm:flex items-center gap-0.5 ml-4 text-xs opacity-60">
          <Command size={11} />
          <span>K</span>
        </div>
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
            style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-xl rounded-2xl border overflow-hidden"
              style={{
                borderColor: "var(--border-primary)",
                background: "var(--bg-card)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b"
                style={{ borderColor: "var(--border-primary)" }}
              >
                <Search size={18} style={{ color: "var(--text-tertiary)" }} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search documentation..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-base"
                  style={{ color: "var(--text-primary)" }}
                />
                {query && (
                  <button
                    onClick={() => { setQuery(""); setResults([]); }}
                    className="p-1 rounded cursor-pointer"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="py-2">
                    {results.map((item, index) => (
                      <button
                        key={item.slug}
                        onClick={() => navigateTo(item)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer"
                        style={{
                          background: selectedIndex === index ? "var(--bg-tertiary)" : "transparent",
                        }}
                      >
                        <div>
                          <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {item.title}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                            {item.description}
                          </div>
                        </div>
                        <ArrowRight
                          size={14}
                          style={{
                            color: selectedIndex === index ? "var(--accent-blue)" : "var(--text-tertiary)",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                ) : query.trim() ? (
                  <div className="py-12 text-center">
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                      No results found for &ldquo;{query}&rdquo;
                    </p>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                      Type to search documentation...
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between px-4 py-2.5 border-t text-xs"
                style={{
                  borderColor: "var(--border-primary)",
                  color: "var(--text-tertiary)",
                  background: "var(--bg-tertiary)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border text-[10px]" style={{ borderColor: "var(--border-primary)" }}>↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border text-[10px]" style={{ borderColor: "var(--border-primary)" }}>⏎</kbd>
                    select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border text-[10px]" style={{ borderColor: "var(--border-primary)" }}>Esc</kbd>
                  close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
