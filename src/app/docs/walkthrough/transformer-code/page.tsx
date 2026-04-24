"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FlowDiagram from "@/components/cards/FlowDiagram";
import WPageNav from "@/components/guide/WPageNav";
import { WALKTHROUGH_BASE } from "@/lib/walkthrough-data";

const BASE = `${WALKTHROUGH_BASE}/transformer-code`;

const subPages = [
  { slug: "how-translib-calls", title: "How Translib Calls Them", c: "#3b82f6", icon: "🔧", desc: "The XlateFuncBind registration system and the xlate.go lookup engine." },
  { slug: "key-transformer", title: "Key Transformer", c: "#06b6d4", icon: "🔑", desc: "Converts a YANG list key into a Redis key string. Returns string." },
  { slug: "field-transformer", title: "Field Transformer", c: "#f59e0b", icon: "⚡", desc: "Converts field values — bidirectional (SET and GET). Returns map[string]string." },
  { slug: "table-transformer", title: "Table Transformer", c: "#8b5cf6", icon: "📋", desc: "Dynamically picks which Redis table to write to. Returns []string." },
  { slug: "return-types", title: "Return Types & Results", c: "#10b981", icon: "↩️", desc: "Complete breakdown of what each transformer type returns and how Translib uses it." },
];

export default function TransformerCodePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="transformer-code">
        <h2 className="!mt-0">4. Transformer Code</h2>
        <p>
          Transformers are <strong>Go functions registered by name</strong> at startup. The annotation 
          references them by a string, and Translib&apos;s <code>xlate</code> engine looks them up 
          and calls them at runtime. This section has 5 sub-pages covering each transformer in detail.
        </p>

        <FlowDiagram
          title="Transformer Lifecycle"
          steps={[
            { label: "Register", sublabel: "init() at startup", color: "#3b82f6", detail: "XlateFuncBind(name, fn)" },
            { label: "Store", sublabel: "global map", color: "#8b5cf6", detail: "map[string]XfmrFunc" },
            { label: "Lookup", sublabel: "on each request", color: "#06b6d4", detail: "find by name string" },
            { label: "Call", sublabel: "execute fn", color: "#f59e0b", detail: "fn(XfmrParams)" },
            { label: "Return", sublabel: "result to Translib", color: "#10b981", detail: "write to Redis" },
          ]}
        />

        <div className="rounded-xl border p-4 my-5 not-prose" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <div className="text-xs font-bold mb-3" style={{ color: "var(--text-primary)" }}>⚡ Execution Order per Request</div>
          <div className="space-y-1.5">
            {[
              { order: "1st", name: "Table Transformer", returns: '[]string{"PORT"}', c: "#8b5cf6" },
              { order: "2nd", name: "Key Transformer", returns: '"Ethernet0"', c: "#06b6d4" },
              { order: "3rd", name: "Pre Transformer", returns: "validation check", c: "#f97316" },
              { order: "4th", name: "Field Transformer (per leaf)", returns: 'map{"admin_status":"up"}', c: "#f59e0b" },
              { order: "5th", name: "Post Transformer", returns: "cross-field side-effect", c: "#ec4899" },
            ].map((item) => (
              <div key={item.order} className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: `${item.c}06`, border: `1px solid ${item.c}15` }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                  style={{ background: item.c }}>{item.order}</span>
                <span className="text-xs font-semibold" style={{ color: item.c }}>{item.name}</span>
                <code className="ml-auto text-[10px]" style={{ color: "var(--text-tertiary)" }}>{item.returns}</code>
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-2 text-center" style={{ color: "var(--text-tertiary)" }}>
            ⚠️ Subtree transformer <strong>replaces all of the above</strong> — runs alone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 not-prose">
          {subPages.map((s) => (
            <Link key={s.slug} href={`${BASE}/${s.slug}`}
              className="group rounded-xl border p-4 transition-all hover:shadow-md"
              style={{ borderColor: `${s.c}25`, background: `${s.c}05` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{s.icon}</span>
                <span className="text-sm font-semibold group-hover:underline" style={{ color: s.c }}>{s.title}</span>
              </div>
              <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>
      <WPageNav
        prev={{ title: "Extensions", slug: "extensions" }}
        next={{ title: "SET Flow", slug: "set-flow" }}
      />
    </motion.div>
  );
}
