"use client";

import React from "react";
import { motion } from "framer-motion";
import FlowDiagram from "@/components/cards/FlowDiagram";
import DirectMappingSection from "@/components/guide/DirectMappingSection";
import KeyXfmrSection from "@/components/guide/KeyXfmrSection";
import FieldXfmrSection from "@/components/guide/FieldXfmrSection";
import TableXfmrSection from "@/components/guide/TableXfmrSection";
import SubtreeXfmrSection from "@/components/guide/SubtreeXfmrSection";
import PrePostXfmrSection from "@/components/guide/PrePostXfmrSection";
import AnnotationAnatomy from "@/components/guide/AnnotationAnatomy";
import DecisionTree from "@/components/guide/DecisionTree";
import VerificationSection from "@/components/guide/VerificationSection";
import CheatsheetSection from "@/components/guide/CheatsheetSection";

export default function AnnotationGuidePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* HERO */}
      <div className="mb-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium mb-4"
          style={{ borderColor: "var(--border-primary)", background: "var(--bg-tertiary)", color: "var(--accent-purple)" }}
        >
          Complete Reference Guide
        </div>
        <h1 className="!mt-0">SONiC OpenConfig Annotation Guide</h1>
        <p>
          Every transformer type — annotation file, Go function, line-by-line explanation, and visual mapping.
          After reading this page you can write any annotation from scratch without support.
        </p>
        <div className="rounded-xl sm:rounded-2xl border p-3 sm:p-4 my-4 sm:my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <div className="text-xs font-semibold mb-2 sm:mb-3" style={{ color: "var(--text-primary)" }}>📖 What this guide covers</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {[
              { n: "1", t: "Annotation Anatomy", c: "#3b82f6" },
              { n: "2", t: "Direct Mapping", c: "#10b981" },
              { n: "3", t: "Key Transformer", c: "#06b6d4" },
              { n: "4", t: "Field Transformer", c: "#f59e0b" },
              { n: "5", t: "Table Transformer", c: "#8b5cf6" },
              { n: "6", t: "Subtree Transformer", c: "#ef4444" },
              { n: "7", t: "Pre / Post Transformer", c: "#ec4899" },
              { n: "8", t: "Decision Tree", c: "#f97316" },
              { n: "9", t: "Verification + Cheatsheet", c: "#14b8a6" },
            ].map((item) => (
              <div key={item.n} className="flex items-center gap-2 text-xs rounded-lg px-2 py-1.5"
                style={{ background: `${item.c}08`, border: `1px solid ${item.c}20` }}>
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: item.c }}>{item.n}</span>
                <span style={{ color: "var(--text-secondary)" }}>{item.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <FlowDiagram
        title="OpenConfig → Annotation → Transformer → Redis"
        steps={[
          { label: "OpenConfig", sublabel: "YANG Model", color: "#3b82f6", detail: "enabled: boolean" },
          { label: "Annotation", sublabel: ".yang file", color: "#8b5cf6", detail: "deviation block" },
          { label: "Transformer", sublabel: "Go function", color: "#f59e0b", detail: "true → \"up\"" },
          { label: "Redis DB", sublabel: "CONFIG_DB", color: "#10b981", detail: "PORT|Ethernet0" },
        ]}
      />

      {/* SECTION 1 — ANATOMY */}
      <AnnotationAnatomy />

      {/* SECTION 2 — DIRECT */}
      <DirectMappingSection />

      {/* SECTION 3 — KEY */}
      <KeyXfmrSection />

      {/* SECTION 4 — FIELD */}
      <FieldXfmrSection />

      {/* SECTION 5 — TABLE */}
      <TableXfmrSection />

      {/* SECTION 6 — SUBTREE */}
      <SubtreeXfmrSection />

      {/* SECTION 7 — PRE / POST */}
      <PrePostXfmrSection />

      {/* SECTION 8 — DECISION TREE */}
      <DecisionTree />

      {/* SECTION 9 — VERIFICATION + CHEATSHEET */}
      <VerificationSection />
      <CheatsheetSection />
    </motion.div>
  );
}
