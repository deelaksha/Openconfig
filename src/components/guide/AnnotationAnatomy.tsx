"use client";
import React from "react";
import { motion } from "framer-motion";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";

export default function AnnotationAnatomy() {
  return (
    <section data-section="annotation-anatomy" id="annotation-anatomy" className="scroll-mt-20">
      <h2>1. Anatomy of an Annotation File</h2>
      <p>
        An annotation file is a <strong>regular YANG file</strong> with a special naming
        convention: <code>openconfig-&lt;module&gt;-annot.yang</code>. It never defines new
        data nodes — it only <em>attaches metadata</em> to existing OpenConfig paths using
        YANG <code>deviation</code> blocks.
      </p>

      {/* File naming rule */}
      <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-primary)" }}>📂 File Naming Convention</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { model: "openconfig-interfaces.yang", annot: "openconfig-interfaces-annot.yang", c: "#3b82f6" },
            { model: "openconfig-vlan.yang", annot: "openconfig-vlan-annot.yang", c: "#8b5cf6" },
            { model: "openconfig-acl.yang", annot: "openconfig-acl-annot.yang", c: "#10b981" },
            { model: "openconfig-bgp.yang", annot: "openconfig-bgp-annot.yang", c: "#f59e0b" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg p-3 font-mono text-[11px] space-y-1"
              style={{ background: "var(--bg-code)", border: `1px solid ${item.c}20` }}>
              <div style={{ color: "var(--text-tertiary)" }}>{item.model}</div>
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--text-tertiary)" }}>↓ annotated by</span>
              </div>
              <div style={{ color: item.c, fontWeight: 600 }}>{item.annot}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Full annotated skeleton */}
      <p>Every annotation file follows this exact skeleton — memorize it:</p>
      <AnnotatedCodeBlock
        title="openconfig-&lt;model&gt;-annot.yang — Full Skeleton"
        language="yang"
        lines={[
          { code: "module openconfig-interfaces-annot {", annotation: "Module name = model name + '-annot'", highlight: true, color: "#3b82f6" },
          { code: "" },
          { code: "  // ── IMPORT 1: the OC model being annotated ──", annotation: "Always import the target OC model" },
          { code: "  import openconfig-interfaces {", highlight: true, color: "#8b5cf6" },
          { code: "    prefix oc-if;", annotation: "Short alias — used in ALL deviation paths", highlight: true, color: "#8b5cf6" },
          { code: "  }", },
          { code: "" },
          { code: "  // ── IMPORT 2: the extensions module ──", annotation: "Always import this — it defines oc-ext:*" },
          { code: "  import openconfig-extensions {", highlight: true, color: "#06b6d4" },
          { code: "    prefix oc-ext;", annotation: "Short alias — used as oc-ext:table-name etc.", highlight: true, color: "#06b6d4" },
          { code: "  }", },
          { code: "" },
          { code: "  // ── OPTIONAL: import other models if paths cross them ──" },
          { code: "  import openconfig-interfaces-ip { prefix oc-ip; }", annotation: "Only if deviation path uses oc-ip: prefix" },
          { code: "" },
          { code: "  // ── DEVIATION BLOCK 1: Map a list node ──" },
          { code: "  deviation /oc-if:interfaces/oc-if:interface {", annotation: "Full prefixed path to YANG node", highlight: true, color: "#f59e0b" },
          { code: "    deviate add {", annotation: "'add' = attach this metadata to the node" },
          { code: "      oc-ext:table-name \"PORT\";", annotation: "→ maps to Redis table PORT", highlight: true, color: "#10b981" },
          { code: "      oc-ext:key-transformer \"intf_tbl_key_xfmr\";", annotation: "→ Go function name for key conversion", highlight: true, color: "#10b981" },
          { code: "    }" },
          { code: "  }" },
          { code: "" },
          { code: "  // ── DEVIATION BLOCK 2: Map a leaf node ──" },
          { code: "  deviation /oc-if:interfaces/oc-if:interface", annotation: "Same list path, continued on next line..." },
          { code: "            /oc-if:config/oc-if:enabled {", annotation: "...then the leaf path — ALL nodes prefixed!", highlight: true, color: "#f59e0b" },
          { code: "    deviate add {" },
          { code: "      oc-ext:field-name \"admin_status\";", annotation: "→ Redis field name", highlight: true, color: "#10b981" },
          { code: "      oc-ext:field-transformer \"intf_enabled_xfmr\";", annotation: "→ Go function for value conversion", highlight: true, color: "#10b981" },
          { code: "    }" },
          { code: "  }" },
          { code: "}", annotation: "Close the module" },
        ]}
      />

      {/* The 4 golden rules */}
      <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "#f59e0b30", background: "#f59e0b04" }}>
        <div className="text-xs font-bold mb-4" style={{ color: "#f59e0b" }}>⚡ 4 Golden Rules — Never Break These</div>
        <div className="space-y-3">
          {[
            { n: "1", rule: "Every node in the deviation path MUST have its module prefix", ok: "/oc-if:interfaces/oc-if:interface/oc-if:config/oc-if:enabled", bad: "/interfaces/interface/config/enabled", c: "#ef4444" },
            { n: "2", rule: "The module name must end in '-annot'", ok: "module openconfig-interfaces-annot {", bad: "module openconfig-interfaces {", c: "#f59e0b" },
            { n: "3", rule: "Transformer name in annotation MUST exactly match XlateFuncBind() name in Go", ok: "oc-ext:field-transformer \"intf_enabled_xfmr\"; → XlateFuncBind(\"intf_enabled_xfmr\", ...)", bad: "\"intf_enabled_Xfmr\" ≠ \"intf_enabled_xfmr\" (case sensitive!)", c: "#8b5cf6" },
            { n: "4", rule: "Use 'deviate add' not 'deviate replace' unless overriding existing annotation", ok: "deviate add { oc-ext:table-name \"PORT\"; }", bad: "deviate replace { ... }  ← only if re-mapping an existing annotation", c: "#06b6d4" },
          ].map((item) => (
            <div key={item.n} className="rounded-xl border overflow-hidden" style={{ borderColor: `${item.c}20` }}>
              <div className="px-4 py-2 flex items-center gap-2" style={{ background: `${item.c}10` }}>
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: item.c }}>{item.n}</span>
                <span className="text-xs font-semibold" style={{ color: item.c }}>{item.rule}</span>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2" style={{ background: "var(--bg-card)" }}>
                <div className="rounded-lg px-3 py-2 font-mono text-[10px]" style={{ background: "#10b98108", border: "1px solid #10b98120" }}>
                  <div className="text-[9px] font-bold mb-1" style={{ color: "#10b981" }}>✓ CORRECT</div>
                  <div style={{ color: "var(--text-secondary)" }}>{item.ok}</div>
                </div>
                <div className="rounded-lg px-3 py-2 font-mono text-[10px]" style={{ background: "#ef444408", border: "1px solid #ef444420" }}>
                  <div className="text-[9px] font-bold mb-1" style={{ color: "#ef4444" }}>✗ WRONG</div>
                  <div style={{ color: "var(--text-secondary)" }}>{item.bad}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extensions overview table */}
      <div className="rounded-2xl border overflow-hidden my-6" style={{ borderColor: "var(--border-primary)" }}>
        <div className="px-5 py-3" style={{ background: "var(--bg-tertiary)" }}>
          <div className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>🔑 All oc-ext Extensions at a Glance</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-primary)", background: "var(--bg-card)" }}>
                <th className="px-4 py-2 text-left font-semibold" style={{ color: "var(--text-tertiary)" }}>Extension</th>
                <th className="px-4 py-2 text-left font-semibold" style={{ color: "var(--text-tertiary)" }}>Applied On</th>
                <th className="px-4 py-2 text-left font-semibold" style={{ color: "var(--text-tertiary)" }}>Purpose</th>
                <th className="px-4 py-2 text-left font-semibold" style={{ color: "var(--text-tertiary)" }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ext: "table-name", on: "list / container", purpose: "Fixed Redis table name", type: "Static", c: "#10b981" },
                { ext: "field-name", on: "leaf", purpose: "Fixed Redis hash field name", type: "Static", c: "#10b981" },
                { ext: "key-transformer", on: "list", purpose: "Go fn: YANG list key → Redis key string", type: "Dynamic", c: "#06b6d4" },
                { ext: "field-transformer", on: "leaf", purpose: "Go fn: converts value both ways (SET+GET)", type: "Dynamic", c: "#f59e0b" },
                { ext: "table-transformer", on: "list / container", purpose: "Go fn: dynamically picks table at runtime", type: "Dynamic", c: "#8b5cf6" },
                { ext: "subtree-transformer", on: "any node", purpose: "Go fn: handles entire branch (replaces all above)", type: "Dynamic", c: "#ef4444" },
                { ext: "db-name", on: "list / container", purpose: "Which Redis DB (CONFIG_DB / APPL_DB / STATE_DB)", type: "Static", c: "#3b82f6" },
                { ext: "key-delimiter", on: "list", purpose: "Override the | separator in composite Redis keys", type: "Static", c: "#ec4899" },
                { ext: "pre-transformer", on: "any node", purpose: "Go fn: runs BEFORE field transformers (validation)", type: "Dynamic", c: "#f97316" },
                { ext: "post-transformer", on: "any node", purpose: "Go fn: runs AFTER field transformers (cross-field)", type: "Dynamic", c: "#14b8a6" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-secondary)", background: "var(--bg-card)" }}>
                  <td className="px-4 py-2.5">
                    <code className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${row.c}12`, color: row.c }}>{row.ext}</code>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[10px]" style={{ color: "var(--text-tertiary)" }}>{row.on}</td>
                  <td className="px-4 py-2.5" style={{ color: "var(--text-secondary)" }}>{row.purpose}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: row.type === "Static" ? "#10b98115" : "#f59e0b15", color: row.type === "Static" ? "#10b981" : "#f59e0b" }}>
                      {row.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
