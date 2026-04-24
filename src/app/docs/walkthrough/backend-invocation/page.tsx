"use client";
import React from "react";
import { motion } from "framer-motion";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import FlowDiagram from "@/components/cards/FlowDiagram";
import WPageNav from "@/components/guide/WPageNav";

export default function BackendInvocationPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="backend-invocation">
        <h2 className="!mt-0">8. Backend: How Translib Invokes Transformers</h2>
        <p>What happens <strong>inside the Go code</strong> when a gNMI request arrives.</p>

        <FlowDiagram title="Transformer Lifecycle" steps={[
          { label: "Register", sublabel: "init() at startup", color: "#3b82f6", detail: "XlateFuncBind(name, fn)" },
          { label: "Store", sublabel: "in global map", color: "#8b5cf6", detail: "map[string]XfmrFunc" },
          { label: "Lookup", sublabel: "on each request", color: "#06b6d4", detail: "find by name string" },
          { label: "Call", sublabel: "execute func", color: "#f59e0b", detail: "fn(XfmrParams)" },
          { label: "Result", sublabel: "map[string]string", color: "#10b981", detail: "write to Redis" },
        ]} />

        <AnnotatedCodeBlock
          title="translib/transformer/xlate.go (simplified)"
          language="go"
          lines={[
            { code: "// STEP 1: Global registry — map of name → function", annotation: "Stores all registered transformers" },
            { code: "var xfmrTbl = map[string]interface{}{}", highlight: true, color: "#3b82f6" },
            { code: "" },
            { code: "// STEP 2: Registration function (called from init())" },
            { code: "func XlateFuncBind(name string, fn interface{}) {", highlight: true, color: "#8b5cf6" },
            { code: "    xfmrTbl[name] = fn", annotation: "Store fn with the given name" },
            { code: "}" },
            { code: "" },
            { code: "// STEP 3: On request — Translib calls this to invoke", annotation: "Called when processing gNMI SET/GET" },
            { code: "func callKeyXfmr(name string, params XfmrParams) (string, error) {", highlight: true, color: "#06b6d4" },
            { code: '    fn, exists := xfmrTbl[name]', annotation: "Look up the function by name" },
            { code: "    if !exists {" },
            { code: '        return "", fmt.Errorf("transformer %s not found", name)', annotation: "Error if name not registered!" },
            { code: "    }" },
            { code: "    keyFn := fn.(KeyXfmrFunc)", annotation: "Type-assert to KeyXfmrFunc" },
            { code: "    return keyFn(params)", annotation: "Execute and return the result", highlight: true, color: "#10b981" },
            { code: "}" },
          ]}
        />

        <div className="rounded-2xl border p-5 my-5 not-prose" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <h4 className="text-sm font-semibold mb-4 !mt-0" style={{ color: "var(--text-primary)" }}>⚡ Execution Order on Each Request</h4>
          <div className="space-y-2">
            {[
              { order: "1st", name: "Table Transformer", when: "if oc-ext:table-transformer exists", returns: '[]string{"PORT"}', color: "#8b5cf6" },
              { order: "2nd", name: "Key Transformer", when: "if oc-ext:key-transformer exists", returns: '"Ethernet0"', color: "#06b6d4" },
              { order: "3rd", name: "Pre Transformer", when: "if sonic-ext:pre-transformer exists", returns: "validation / auth check", color: "#f97316" },
              { order: "4th", name: "Field Transformer", when: "if oc-ext:field-transformer exists (per leaf)", returns: 'map{"admin_status": "up"}', color: "#f59e0b" },
              { order: "5th", name: "Post Transformer", when: "if sonic-ext:post-transformer exists", returns: "cross-field validation", color: "#ec4899" },
            ].map((item) => (
              <div key={item.order} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ background: item.color }}>{item.order}</div>
                <div className="flex-1 rounded-lg px-3 py-2" style={{ background: `${item.color}06`, border: `1px solid ${item.color}15` }}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-semibold" style={{ color: item.color }}>{item.name}</span>
                    <code className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>{item.returns}</code>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.when}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WPageNav prev={{ title: "Redis DB Output", slug: "redis-output" }} next={{ title: "Verification", slug: "verify-annotation" }} />
    </motion.div>
  );
}
