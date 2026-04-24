"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const sections = [
  {
    href: "/docs/walkthrough",
    label: "End-to-End Walkthrough",
    icon: "🔄",
    color: "#3b82f6",
    badge: "Start here",
    desc: "Trace the interface enabled leaf from OpenConfig YANG through annotation, transformer code, all the way to Redis — and back.",
    items: ["YANG Model", "Annotation File", "Extensions", "Transformer Code (Key, Field, Table)", "SET & GET Flow", "Redis DB Output", "Verification"],
  },
  {
    href: "/docs/annotation-guide",
    label: "Annotation Guide",
    icon: "📝",
    color: "#8b5cf6",
    badge: "Reference",
    desc: "Complete reference for every transformer type — annotation anatomy, decision tree, Go implementation patterns, and cheatsheet.",
    items: ["Annotation Anatomy", "Direct Mapping", "Key / Field / Table / Subtree Transformers", "Pre / Post Transformer", "Decision Tree", "Verification Checklist", "Cheatsheet"],
  },
];

export default function DocsHubPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-start">
      <main className="flex-1 px-4 sm:px-8 lg:px-16 py-10 sm:py-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium mb-5"
            style={{ borderColor: "var(--border-primary)", background: "var(--bg-tertiary)", color: "var(--accent-blue)" }}>
            SONiC OpenConfig Framework
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 !mt-0" style={{ color: "var(--text-primary)" }}>
            Developer Documentation
          </h1>
          <p className="text-base mb-10 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            Everything you need to understand how OpenConfig YANG models map to SONiC Redis entries —
            from the annotation file syntax to Go transformer code.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {sections.map((s) => (
              <Link key={s.href} href={s.href}
                className="group rounded-2xl border p-6 transition-all hover:shadow-lg"
                style={{ borderColor: `${s.color}25`, background: `${s.color}04` }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${s.color}15` }}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base font-bold group-hover:underline" style={{ color: s.color }}>{s.label}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: `${s.color}15`, color: s.color }}>{s.badge}</span>
                    </div>
                    <p className="text-xs leading-relaxed !mt-0 !mb-0" style={{ color: "var(--text-tertiary)" }}>{s.desc}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {s.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: s.color }} />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: s.color }}>
                  Open section →
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
