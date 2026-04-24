"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnnotatedLine {
  code: string;
  annotation?: string;
  highlight?: boolean;
  color?: string;
}

interface AnnotatedCodeBlockProps {
  lines: AnnotatedLine[];
  title?: string;
  language?: string;
}

const langColors: Record<string, string> = {
  yang: "#10b981",
  python: "#f59e0b",
  go: "#3b82f6",
  bash: "#06b6d4",
  json: "#8b5cf6",
  redis: "#ef4444",
};

export default function AnnotatedCodeBlock({ lines, title, language = "yang" }: AnnotatedCodeBlockProps) {
  const accent = langColors[language] || "#8b5cf6";

  return (
    <div
      className="rounded-xl sm:rounded-2xl border overflow-hidden my-4 sm:my-6"
      style={{ borderColor: "var(--border-primary)", background: "var(--bg-code)" }}
    >
      {/* Header */}
      {title && (
        <div
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border-b"
          style={{ borderColor: "var(--border-primary)", background: "var(--bg-tertiary)" }}
        >
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff5f57] opacity-70" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#febc2e] opacity-70" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#28c840] opacity-70" />
          </div>
          <span className="text-[10px] sm:text-xs font-mono ml-1 sm:ml-2 truncate min-w-0" style={{ color: "var(--text-secondary)" }}>
            {title}
          </span>
          <span
            className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded ml-auto shrink-0"
            style={{ color: accent, background: `${accent}15` }}
          >
            {language}
          </span>
        </div>
      )}

      {/* Lines with annotations */}
      <div className="divide-y" style={{ borderColor: "var(--border-secondary)" }}>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex flex-col sm:flex-row"
            style={{
              background: line.highlight ? `${line.color || accent}08` : "transparent",
              borderLeft: line.highlight ? `3px solid ${line.color || accent}` : "3px solid transparent",
            }}
          >
            {/* Code part */}
            <div className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 min-w-0">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-[9px] sm:text-[10px] font-mono w-4 sm:w-5 text-right shrink-0 pt-0.5" style={{ color: "var(--text-tertiary)", opacity: 0.5 }}>
                  {i + 1}
                </span>
                <pre className="text-[11px] sm:text-[13px] font-mono whitespace-pre-wrap break-all leading-5" style={{ color: "var(--text-primary)" }}>
                  {line.code}
                </pre>
              </div>
            </div>

            {/* Annotation part */}
            {line.annotation && (
              <div
                className="sm:w-[260px] shrink-0 px-2 sm:px-4 py-1 sm:py-2 flex items-start gap-1.5 sm:gap-2 border-t sm:border-t-0 sm:border-l"
                style={{
                  borderColor: "var(--border-secondary)",
                  background: `${line.color || accent}05`,
                }}
              >
                <span className="text-[10px] sm:text-xs mt-0.5 shrink-0" style={{ color: line.color || accent }}>←</span>
                <span className="text-[10px] sm:text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {line.annotation}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
