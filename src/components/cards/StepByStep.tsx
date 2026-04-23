"use client";

import React from "react";
import { motion } from "framer-motion";

interface Step {
  title: string;
  description: string;
  visual?: React.ReactNode;
  color?: string;
  before?: string;
  after?: string;
}

interface StepByStepProps {
  steps: Step[];
  title?: string;
}

export default function StepByStep({ steps, title }: StepByStepProps) {
  return (
    <div className="my-8">
      {title && (
        <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
      )}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-5 top-4 bottom-4 w-px"
          style={{ background: "var(--border-primary)" }}
        />

        <div className="space-y-6">
          {steps.map((step, i) => {
            const color = step.color || "#3b82f6";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative flex gap-4 pl-0"
              >
                {/* Step number circle */}
                <div
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg"
                  style={{ background: color }}
                >
                  {i + 1}
                </div>

                {/* Content */}
                <div
                  className="flex-1 rounded-xl border p-4 -mt-1"
                  style={{
                    borderColor: `${color}25`,
                    background: `${color}05`,
                  }}
                >
                  <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    {step.title}
                  </div>
                  <div className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                    {step.description}
                  </div>

                  {/* Before/After visual */}
                  {(step.before || step.after) && (
                    <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-2">
                      {step.before && (
                        <div className="flex-1 rounded-lg px-3 py-2 font-mono text-xs"
                          style={{ background: "var(--bg-code)", color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }}
                        >
                          <div className="text-[9px] uppercase font-semibold mb-1 opacity-50">Input</div>
                          {step.before}
                        </div>
                      )}
                      {step.before && step.after && (
                        <div className="flex items-center justify-center text-xs px-1" style={{ color }}>
                          →
                        </div>
                      )}
                      {step.after && (
                        <div className="flex-1 rounded-lg px-3 py-2 font-mono text-xs"
                          style={{ background: `${color}10`, color, border: `1px solid ${color}25` }}
                        >
                          <div className="text-[9px] uppercase font-semibold mb-1 opacity-60">Output</div>
                          {step.after}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Custom visual */}
                  {step.visual && <div className="mt-2">{step.visual}</div>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
