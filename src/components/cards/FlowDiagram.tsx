"use client";

import React from "react";
import { motion } from "framer-motion";

interface FlowStep {
  label: string;
  sublabel?: string;
  color: string;
  detail?: string;
}

interface FlowDiagramProps {
  title: string;
  steps: FlowStep[];
}

export default function FlowDiagram({ title, steps }: FlowDiagramProps) {
  return (
    <div className="rounded-xl sm:rounded-2xl border p-4 sm:p-6 my-4 sm:my-6 overflow-hidden"
      style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
      <h4 className="text-xs sm:text-sm font-semibold mb-4 sm:mb-5 text-center" style={{ color: "var(--text-primary)" }}>
        {title}
      </h4>

      {/* Horizontal scrollable on mobile */}
      <div className="overflow-x-auto -mx-2 px-2 pb-2 flow-diagram-scroll">
        <div className="flex items-center gap-1 sm:gap-2 min-w-max sm:min-w-0 sm:justify-center">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center shrink-0"
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center mb-1 sm:mb-2"
                  style={{ background: `${step.color}12`, border: `1px solid ${step.color}30` }}
                >
                  <span className="text-[10px] sm:text-xs font-bold" style={{ color: step.color }}>
                    {step.label}
                  </span>
                  {step.sublabel && (
                    <span className="text-[8px] sm:text-[9px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      {step.sublabel}
                    </span>
                  )}
                </div>
                {step.detail && (
                  <span className="text-[8px] sm:text-[10px] font-mono max-w-[5rem] sm:max-w-[7rem] truncate"
                    style={{ color: "var(--text-tertiary)" }}>
                    {step.detail}
                  </span>
                )}
              </motion.div>

              {i < steps.length - 1 && (
                <div className="shrink-0">
                  <svg width="20" height="12" viewBox="0 0 24 12" fill="none" className="opacity-30 sm:w-6 w-5">
                    <path d="M0 6H20M20 6L14 1M20 6L14 11" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
