"use client";
import React from "react";
import { motion } from "framer-motion";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import FlowDiagram from "@/components/cards/FlowDiagram";
import WPageNav from "@/components/guide/WPageNav";

export default function HowTranslibCallsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="how-translib-calls">
        <h2 className="!mt-0">How Translib Calls Transformers</h2>
        <p>
          All transformers are registered into a <strong>global name → function map</strong> at startup.
          When a gNMI request arrives, Translib&apos;s <code>xlate.go</code> reads the annotation, finds the
          transformer name, looks it up in the map, and calls the function.
        </p>

        <FlowDiagram
          title="From Annotation String to Function Call"
          steps={[
            { label: "Annotation", sublabel: '"intf_enabled_xfmr"', color: "#8b5cf6", detail: "name string" },
            { label: "xlate.go", sublabel: "reads annotation", color: "#06b6d4", detail: "on request" },
            { label: "xfmrTbl lookup", sublabel: "global map", color: "#f59e0b", detail: 'find "intf_enabled_xfmr"' },
            { label: "fn(XfmrParams)", sublabel: "execute", color: "#10b981", detail: "Go function runs" },
          ]}
        />

        <h3>Step 1: Registration (init() at startup)</h3>
        <AnnotatedCodeBlock
          title="intf_enabled_xfmr.go — Registration"
          language="go"
          lines={[
            { code: "func init() {", annotation: "Go calls init() automatically at startup" },
            { code: '    XlateFuncBind("intf_enabled_xfmr", intf_enabled_xfmr)', annotation: "Register: name → function pointer", highlight: true, color: "#f59e0b" },
            { code: "}", annotation: "Now the name is findable by Translib" },
          ]}
        />

        <h3>Step 2: The Global Registry (translib/transformer/xlate.go)</h3>
        <AnnotatedCodeBlock
          title="xlate.go — Simplified registration engine"
          language="go"
          lines={[
            { code: "// Global registry — maps string name → function", annotation: "One map for all registered transformers" },
            { code: "var xfmrTbl = map[string]interface{}{}", highlight: true, color: "#3b82f6" },
            { code: "" },
            { code: "// XlateFuncBind is called by every transformer's init()", annotation: "Called once per transformer at startup" },
            { code: "func XlateFuncBind(name string, fn interface{}) {", highlight: true, color: "#8b5cf6" },
            { code: "    xfmrTbl[name] = fn", annotation: "Store fn under the given name string" },
            { code: "}" },
          ]}
        />

        <h3>Step 3: Lookup and Call (on each gNMI request)</h3>
        <AnnotatedCodeBlock
          title="xlate.go — How field transformer is looked up and called"
          language="go"
          lines={[
            { code: "func callFieldXfmr(name string, params XfmrParams) (map[string]string, error) {", annotation: "Called during SET/GET processing" },
            { code: "    fn, exists := xfmrTbl[name]", annotation: "Look up by the name from annotation", highlight: true, color: "#06b6d4" },
            { code: "    if !exists {" },
            { code: '        return nil, fmt.Errorf("transformer %s not found", name)', annotation: "❌ This means name in annotation doesn't match init()!" },
            { code: "    }" },
            { code: "    fieldFn := fn.(FieldXfmrFunc)", annotation: "Type-assert to the correct function type", highlight: true, color: "#8b5cf6" },
            { code: "    return fieldFn(params)", annotation: "Execute and return the conversion result", highlight: true, color: "#10b981" },
            { code: "}" },
          ]}
        />

        <div className="rounded-xl border p-4 my-5 not-prose" style={{ borderColor: "#f59e0b30", background: "#f59e0b04" }}>
          <div className="text-xs font-bold mb-3" style={{ color: "#f59e0b" }}>📦 XfmrParams — What the function receives</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { field: ".uri", value: "/interfaces/interface[name=Ethernet0]/config/enabled", desc: "Full gNMI path" },
              { field: ".oper", value: "GET or SET", desc: "Read or write direction" },
              { field: ".param", value: "true (SET) or \"up\" (GET)", desc: "The value being transformed" },
              { field: ".key", value: '"Ethernet0"', desc: "Already-extracted list key" },
              { field: ".dbs", value: "[ConfigDB, ApplDB, StateDB, ...]", desc: "DB connections available for reads" },
              { field: ".requestUri", value: "original top-level request path", desc: "The full gNMI path from the client" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg px-3 py-2 text-xs" style={{ background: "var(--bg-code)" }}>
                <code className="font-bold" style={{ color: "#3b82f6" }}>{item.field}</code>
                <div className="mt-0.5 font-mono text-[10px]" style={{ color: "var(--text-secondary)" }}>{item.value}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WPageNav
        prev={{ title: "Transformer Code Overview", slug: "transformer-code" }}
        next={{ title: "Key Transformer", slug: "transformer-code/key-transformer" }}
      />
    </motion.div>
  );
}
