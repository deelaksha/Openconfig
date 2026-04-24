"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FlowDiagram from "@/components/cards/FlowDiagram";
import { WALKTHROUGH_BASE } from "@/lib/walkthrough-data";

const steps = [
  { n: "1", t: "YANG Model", slug: "yang-model", c: "#3b82f6", desc: "The OpenConfig interface model — what engineers see." },
  { n: "2", t: "Annotation File", slug: "annotation-file", c: "#8b5cf6", desc: "The .yang file that maps paths to Redis tables and fields." },
  { n: "3", t: "Extensions (oc-ext)", slug: "extensions", c: "#06b6d4", desc: "Keywords that declare table-name, field-name, key/field/table transformers." },
  { n: "4", t: "Transformer Code", slug: "transformer-code", c: "#f59e0b", desc: "Go functions that convert values — with sub-pages per transformer type.", badge: "Deep dive" },
  { n: "5", t: "SET Flow", slug: "set-flow", c: "#ec4899", desc: "The full write path: OC value → annotation → transformer → Redis HSET." },
  { n: "6", t: "GET Flow", slug: "get-flow", c: "#10b981", desc: "The reverse: Redis HGET → transformer → OC value → gNMI response." },
  { n: "7", t: "Redis DB Output", slug: "redis-output", c: "#14b8a6", desc: "Final state in CONFIG_DB, APPL_DB, STATE_DB after writes." },
  { n: "8", t: "Backend Invocation", slug: "backend-invocation", c: "#f97316", desc: "How Translib's xlate engine calls transformers at runtime." },
  { n: "9", t: "Verification", slug: "verify-annotation", c: "#3b82f6", desc: "Redis CLI and gNMI checks to confirm your annotation is correct." },
];

export default function WalkthroughPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium mb-4"
          style={{ borderColor: "var(--border-primary)", background: "var(--bg-tertiary)", color: "var(--accent-blue)" }}>
          End-to-End Walkthrough
        </div>
        <h1 className="!mt-0">Interface <code>enabled</code> → <code>admin_status</code></h1>
        <p>
          One feature, fully traced: from the OpenConfig YANG model through the annotation file, 
          extensions, and transformer Go code, all the way to Redis — and back again.
        </p>
        <div className="rounded-xl border p-4 my-5 not-prose" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
            📌 The Transformer Code section has its own sub-pages with deep implementation details
          </div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Use the sidebar to navigate. Transformer Code → How Translib Calls Them, Key, Field, Table Transformers, and Return Types.
          </div>
        </div>
      </div>

      <FlowDiagram
        title="The Complete Pipeline"
        steps={[
          { label: "OpenConfig", sublabel: "YANG Model", color: "#3b82f6", detail: "enabled = true" },
          { label: "Annotation", sublabel: ".yang file", color: "#8b5cf6", detail: "maps path → table" },
          { label: "Transformer", sublabel: "Go function", color: "#f59e0b", detail: 'true → "up"' },
          { label: "Redis DB", sublabel: "CONFIG_DB", color: "#10b981", detail: "PORT|Ethernet0" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 not-prose">
        {steps.map((s) => (
          <Link key={s.slug} href={`${WALKTHROUGH_BASE}/${s.slug}`}
            className="group rounded-xl border p-4 transition-all hover:shadow-md"
            style={{ borderColor: `${s.c}25`, background: `${s.c}05` }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: s.c }}>
                {s.n}
              </span>
              <span className="text-sm font-semibold group-hover:underline" style={{ color: s.c }}>{s.t}</span>
              {s.badge && (
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#f59e0b15", color: "#f59e0b" }}>
                  {s.badge}
                </span>
              )}
            </div>
            <p className="text-xs m-0 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{s.desc}</p>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
