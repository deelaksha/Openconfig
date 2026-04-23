"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface TabItem {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
}

export default function Tabs({ items, defaultIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className="my-4 rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--border-primary)" }}
    >
      {/* Tab Headers */}
      <div
        className="flex border-b overflow-x-auto"
        style={{ 
          borderColor: "var(--border-primary)",
          background: "var(--bg-tertiary)",
        }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className="relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2"
            style={{
              color: activeIndex === index ? "var(--text-primary)" : "var(--text-tertiary)",
            }}
          >
            {item.icon}
            {item.label}
            {activeIndex === index && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: "var(--accent-blue)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ background: "var(--bg-card)" }}
      >
        {items[activeIndex].content}
      </motion.div>
    </div>
  );
}
