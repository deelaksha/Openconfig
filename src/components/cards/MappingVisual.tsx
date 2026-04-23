"use client";

import React from "react";
import { motion } from "framer-motion";

interface MappingRow {
  left: string;
  right: string;
  label?: string;
  color?: string;
}

interface MappingVisualProps {
  leftTitle: string;
  rightTitle: string;
  leftColor: string;
  rightColor: string;
  rows: MappingRow[];
  title?: string;
}

export default function MappingVisual({
  leftTitle,
  rightTitle,
  leftColor,
  rightColor,
  rows,
  title,
}: MappingVisualProps) {
  return (
    <div
      className="rounded-2xl border p-6 my-6 overflow-hidden"
      style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}
    >
      {title && (
        <h4 className="text-sm font-semibold mb-5 text-center" style={{ color: "var(--text-primary)" }}>
          {title}
        </h4>
      )}

      {/* Headers */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 text-center">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{ color: leftColor, background: `${leftColor}15` }}
          >
            {leftTitle}
          </span>
        </div>
        <div className="w-16 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>maps to</div>
        <div className="flex-1 text-center">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{ color: rightColor, background: `${rightColor}15` }}
          >
            {rightTitle}
          </span>
        </div>
      </div>

      {/* Mapping rows */}
      <div className="space-y-2">
        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="flex items-center gap-2"
          >
            {/* Left value */}
            <div className="flex-1 text-right">
              <code className="text-xs font-mono px-2.5 py-1.5 rounded-lg inline-block"
                style={{ background: `${leftColor}10`, color: leftColor, border: `1px solid ${leftColor}20` }}
              >
                {row.left}
              </code>
            </div>

            {/* Arrow with optional label */}
            <div className="w-16 flex flex-col items-center gap-0.5 shrink-0">
              <svg width="40" height="12" viewBox="0 0 40 12" fill="none" className="opacity-40">
                <path d="M0 6H36M36 6L30 1M36 6L30 11" stroke={row.color || "var(--text-tertiary)"} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {row.label && (
                <span className="text-[8px] font-medium" style={{ color: row.color || "var(--text-tertiary)" }}>
                  {row.label}
                </span>
              )}
            </div>

            {/* Right value */}
            <div className="flex-1">
              <code className="text-xs font-mono px-2.5 py-1.5 rounded-lg inline-block"
                style={{ background: `${rightColor}10`, color: rightColor, border: `1px solid ${rightColor}20` }}
              >
                {row.right}
              </code>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
