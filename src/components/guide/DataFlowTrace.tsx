"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FlowStep {
  line: string;           // The actual Go code line
  variable?: string;      // Variable being set/read on this line
  value?: string;         // What the value IS at this point
  explain: string;        // Plain-English explanation
  highlight?: boolean;
  color?: string;
  isComment?: boolean;
}

interface DataFlowTraceProps {
  title: string;
  scenario: string;       // e.g. "SET: enabled=true for Ethernet0"
  steps: FlowStep[];
  accent?: string;
}

export default function DataFlowTrace({ title, scenario, steps, accent = "#3b82f6" }: DataFlowTraceProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  return (
    <div className="rounded-2xl border overflow-hidden my-6" style={{ borderColor: `${accent}30` }}>
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-2"
        style={{ background: `${accent}10`, borderBottom: `1px solid ${accent}20` }}>
        <div>
          <div className="text-xs font-bold" style={{ color: accent }}>{title}</div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            📍 Scenario: <span style={{ color: accent }}>{scenario}</span>
          </div>
        </div>
        <div className="text-[10px] px-2 py-1 rounded-full" style={{ background: `${accent}15`, color: accent }}>
          Hover any line to pin explanation
        </div>
      </div>

      {/* Two-panel layout: code + live explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ background: "var(--bg-code)" }}>
        {/* LEFT: Annotated code */}
        <div className="border-r" style={{ borderColor: "var(--border-secondary)" }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onMouseEnter={() => setHoveredLine(i)}
              onMouseLeave={() => setHoveredLine(null)}
              className="flex items-stretch cursor-pointer transition-all group"
              style={{
                background: hoveredLine === i
                  ? `${step.color || accent}12`
                  : step.highlight
                  ? `${step.color || accent}08`
                  : "transparent",
                borderLeft: step.highlight
                  ? `3px solid ${step.color || accent}`
                  : hoveredLine === i
                  ? `3px solid ${step.color || accent}80`
                  : "3px solid transparent",
              }}
            >
              {/* Line number */}
              <div className="w-9 py-2 flex items-start justify-end pr-3 shrink-0 select-none">
                <span className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)", opacity: 0.5 }}>
                  {step.isComment ? "" : i + 1}
                </span>
              </div>
              {/* Code */}
              <div className="flex-1 py-2 pr-4 min-w-0">
                <pre className="text-[12px] font-mono whitespace-pre-wrap break-all leading-5"
                  style={{
                    color: step.isComment
                      ? "var(--text-tertiary)"
                      : step.color || "var(--text-primary)",
                  }}>
                  {step.line}
                </pre>
              </div>
              {/* Variable badge (shown inline if variable present) */}
              {step.variable && (
                <div className="flex items-center pr-3 shrink-0">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `${accent}20`, color: accent }}>
                    {step.variable}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* RIGHT: Live explanation panel */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {hoveredLine !== null ? (
              <motion.div
                key={hoveredLine}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl p-4" style={{ background: `${steps[hoveredLine]?.color || accent}10`, border: `1px solid ${steps[hoveredLine]?.color || accent}25` }}>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: steps[hoveredLine]?.color || accent }}>
                    Line {hoveredLine + 1} — What happens here
                  </div>
                  <div className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-primary)" }}>
                    {steps[hoveredLine]?.explain}
                  </div>
                  {steps[hoveredLine]?.variable && (
                    <div className="rounded-lg p-3 mt-2" style={{ background: "var(--bg-code)", border: "1px solid var(--border-primary)" }}>
                      <div className="text-[9px] uppercase font-bold mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                        Variable state after this line
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] font-bold" style={{ color: steps[hoveredLine]?.color || accent }}>
                          {steps[hoveredLine]?.variable}
                        </code>
                        <span style={{ color: "var(--text-tertiary)" }}>=</span>
                        <code className="text-[11px]" style={{ color: "#10b981" }}>
                          {steps[hoveredLine]?.value || "—"}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-8"
              >
                <div className="text-4xl mb-3">👆</div>
                <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                  Hover a code line to see
                </div>
                <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                  what the variable holds at that exact point
                </div>
                {/* Static summary of all variables */}
                <div className="mt-6 w-full space-y-1.5">
                  {steps.filter(s => s.variable && s.value).map((s, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg px-3 py-1.5 text-[10px]"
                      style={{ background: `${s.color || accent}08`, border: `1px solid ${s.color || accent}15` }}>
                      <code className="font-bold" style={{ color: s.color || accent }}>{s.variable}</code>
                      <code style={{ color: "#10b981" }}>{s.value}</code>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
