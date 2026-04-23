"use client";

import React from "react";
import { motion } from "framer-motion";

interface FlowStep {
  label: string;
  sublabel?: string;
  color: string;
  icon?: React.ReactNode;
  detail?: string;
}

interface FlowDiagramProps {
  steps: FlowStep[];
  title?: string;
  direction?: "horizontal" | "vertical";
}

export default function FlowDiagram({ steps, title, direction = "horizontal" }: FlowDiagramProps) {
  const isVertical = direction === "vertical";

  return (
    <div
      className="rounded-2xl border p-6 sm:p-8 my-6 overflow-x-auto"
      style={{
        borderColor: "var(--border-primary)",
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {title && (
        <h4 className="text-sm font-semibold mb-6 text-center" style={{ color: "var(--text-primary)" }}>
          {title}
        </h4>
      )}
      <div className={`flex ${isVertical ? "flex-col items-center" : "flex-row flex-wrap items-center justify-center"} gap-2 sm:gap-3`}>
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex flex-col items-center gap-2 min-w-[110px] max-w-[160px]"
            >
              {/* Circle icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg"
                style={{ background: step.color }}
              >
                {step.icon || (i + 1)}
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold" style={{ color: step.color }}>
                  {step.label}
                </div>
                {step.sublabel && (
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                    {step.sublabel}
                  </div>
                )}
              </div>
              {step.detail && (
                <div
                  className="text-[10px] text-center px-2 py-1 rounded-lg max-w-[140px]"
                  style={{ background: `${step.color}10`, color: "var(--text-secondary)" }}
                >
                  {step.detail}
                </div>
              )}
            </motion.div>

            {/* Arrow between steps */}
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.12 + 0.1 }}
                className={`flex items-center justify-center ${isVertical ? "rotate-90" : ""}`}
                style={{ color: "var(--text-tertiary)" }}
              >
                <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                  <path d="M0 8H24M24 8L18 2M24 8L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
