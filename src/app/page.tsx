"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import FlowDiagram from "@/components/cards/FlowDiagram";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--accent-blue)" }}
        />
        <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--accent-purple)" }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-6"
              style={{ borderColor: "var(--border-primary)", background: "var(--bg-tertiary)", color: "var(--accent-blue)" }}
            >
              <Zap size={12} />
              <span>SONiC OpenConfig Annotation Framework</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            One Feature,{" "}
            <span className="gradient-text">End-to-End</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            See how a single OpenConfig leaf — <code>enabled</code> — flows through the 
            annotation file, extensions, and transformers to become <code>admin_status</code> 
            in Redis. Every step visualized.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: "var(--gradient-brand)" }}
            >
              View the Complete Flow
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Flow Preview */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <FlowDiagram
          title="OpenConfig → SONiC Redis Pipeline"
          steps={[
            { label: "YANG Model", sublabel: "enabled: boolean", color: "#3b82f6", detail: "leaf boolean" },
            { label: "Annotation", sublabel: ".yang deviation", color: "#8b5cf6", detail: "oc-ext mapping" },
            { label: "Transformer", sublabel: 'true → "up"', color: "#f59e0b", detail: "Go function" },
            { label: "Redis DB", sublabel: "CONFIG_DB", color: "#10b981", detail: "PORT|Ethernet0" },
          ]}
        />

        {/* What you'll see */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
          {[
            { title: "YANG Model", desc: "The OpenConfig interface definition", color: "#3b82f6" },
            { title: "Annotation + Extensions", desc: "Mapping rules via oc-ext", color: "#8b5cf6" },
            { title: "All 3 Transformers", desc: "Key, Field, and Table — line by line", color: "#f59e0b" },
            { title: "SET Flow (Write)", desc: "OpenConfig → Redis step by step", color: "#06b6d4" },
            { title: "GET Flow (Read)", desc: "Redis → OpenConfig step by step", color: "#ec4899" },
            { title: "Redis DB State", desc: "CONFIG_DB, APPL_DB, STATE_DB entries", color: "#10b981" },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border p-4"
              style={{ borderColor: `${item.color}25`, background: `${item.color}05` }}
            >
              <div className="text-xs font-semibold mb-1" style={{ color: item.color }}>{item.title}</div>
              <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-secondary)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
              <span className="text-white font-bold text-[10px]">S</span>
            </div>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>SONiC OpenConfig Docs</span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Built with Next.js</span>
        </div>
      </footer>
    </div>
  );
}
