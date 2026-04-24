"use client";

import React from "react";
import { motion } from "framer-motion";

interface Step {
  title: string;
  description: string;
  before?: string;
  after?: string;
  color: string;
}

interface StepByStepProps {
  steps: Step[];
}

export default function StepByStep({ steps }: StepByStepProps) {
  return (
    <div className="space-y-3 sm:space-y-4 my-4 sm:my-6">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="rounded-xl sm:rounded-2xl border overflow-hidden"
          style={{ borderColor: `${step.color}25` }}
        >
          {/* Header */}
          <div className="px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2 sm:gap-3"
            style={{ background: `${step.color}10` }}>
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shrink-0"
              style={{ background: step.color }}>
              {i + 1}
            </span>
            <span className="text-[11px] sm:text-sm font-semibold" style={{ color: step.color }}>
              {step.title}
            </span>
          </div>

          {/* Content */}
          <div className="px-3 sm:px-5 py-2 sm:py-3 space-y-2" style={{ background: "var(--bg-card)" }}>
            <p className="text-[11px] sm:text-xs" style={{ color: "var(--text-secondary)" }}>
              {step.description}
            </p>

            {(step.before || step.after) && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 text-[10px] sm:text-[11px]">
                {step.before && (
                  <code className="px-2 py-1 rounded-md font-mono break-all"
                    style={{ background: "var(--bg-code)", color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }}>
                    {step.before}
                  </code>
                )}
                {step.before && step.after && (
                  <span className="hidden sm:inline" style={{ color: "var(--text-tertiary)" }}>→</span>
                )}
                {step.after && (
                  <code className="px-2 py-1 rounded-md font-mono font-semibold break-all"
                    style={{ background: `${step.color}10`, color: step.color, border: `1px solid ${step.color}20` }}>
                    {step.after}
                  </code>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
