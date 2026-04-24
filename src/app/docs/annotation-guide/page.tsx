"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FlowDiagram from "@/components/cards/FlowDiagram";
import { GUIDE_BASE, annotationGuideNav } from "@/lib/annotation-guide-data";

const sections = [
  { n: "1", t: "Annotation Anatomy", slug: "annotation-anatomy", c: "#3b82f6", desc: "File naming, deviation block syntax, and YANG extension rules." },
  { n: "2", t: "Direct Mapping", slug: "direct-mapping", c: "#10b981", desc: "Map a field with no Go code — just field-name in the annotation." },
  { n: "3", t: "Key Transformer", slug: "key-transformer", c: "#06b6d4", desc: "Build the Redis key from the YANG list key using a Go function." },
  { n: "4", t: "Field Transformer", slug: "field-transformer", c: "#f59e0b", desc: "Convert field values between OpenConfig types and SONiC strings." },
  { n: "5", t: "Table Transformer", slug: "table-transformer", c: "#8b5cf6", desc: "Dynamically decide which Redis table to write to at runtime." },
  { n: "6", t: "Subtree Transformer", slug: "subtree-transformer", c: "#ef4444", desc: "Own an entire YANG subtree — write to multiple Redis tables in one function." },
  { n: "7", t: "Pre / Post Transformer", slug: "pre-post-transformer", c: "#ec4899", desc: "Validate before writes (Pre) and add cross-field side effects after (Post)." },
  { n: "8", t: "Decision Tree", slug: "decision-tree", c: "#f97316", desc: "Pick the right transformer type for any mapping scenario." },
  { n: "9", t: "Verification", slug: "verification", c: "#14b8a6", desc: "Check your annotation is correct with Redis CLI and gNMI queries." },
  { n: "10", t: "Cheatsheet", slug: "cheatsheet", c: "#f59e0b", desc: "Quick-reference for all extensions and transformer signatures." },
];

export default function AnnotationGuidePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Hero */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium mb-4"
          style={{ borderColor: "var(--border-primary)", background: "var(--bg-tertiary)", color: "var(--accent-purple)" }}
        >
          Complete Reference Guide
        </div>
        <h1 className="!mt-0">SONiC OpenConfig Annotation Guide</h1>
        <p>
          Every transformer type — annotation file, Go function, line-by-line explanation, and visual mapping.
          After reading this guide you can write any annotation from scratch without support.
        </p>
        <div className="rounded-xl border p-4 my-5" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-tertiary)" }}>
            💡 Each section is on its own page — use the sidebar to navigate
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Click any card below or use the left sidebar to jump to a specific topic.
          </div>
        </div>
      </div>

      {/* Pipeline overview */}
      <FlowDiagram
        title="OpenConfig → Annotation → Transformer → Redis"
        steps={[
          { label: "OpenConfig", sublabel: "YANG Model", color: "#3b82f6", detail: "enabled: boolean" },
          { label: "Annotation", sublabel: ".yang file", color: "#8b5cf6", detail: "deviation block" },
          { label: "Transformer", sublabel: "Go function", color: "#f59e0b", detail: 'true → "up"' },
          { label: "Redis DB", sublabel: "CONFIG_DB", color: "#10b981", detail: "PORT|Ethernet0" },
        ]}
      />

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {sections.map((s) => (
          <Link
            key={s.slug}
            href={`${GUIDE_BASE}/${s.slug}`}
            className="group rounded-xl border p-4 transition-all hover:shadow-md"
            style={{
              borderColor: `${s.c}25`,
              background: `${s.c}05`,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: s.c }}
              >
                {s.n}
              </span>
              <span className="text-sm font-semibold group-hover:underline" style={{ color: s.c }}>
                {s.t}
              </span>
            </div>
            <p className="text-xs m-0 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              {s.desc}
            </p>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
