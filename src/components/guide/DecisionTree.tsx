"use client";
import React from "react";
import { motion } from "framer-motion";

export default function DecisionTree() {
  const nodes = [
    {
      q: "Does one OC path write to 2+ Redis tables?",
      yes: "→ Subtree Transformer",
      no: "Continue ↓",
      yesC: "#ef4444",
    },
    {
      q: "Does the Redis table depend on runtime values (e.g. interface name prefix)?",
      yes: "→ Table Transformer",
      no: "Use static table-name",
      yesC: "#8b5cf6",
    },
    {
      q: "Does the YANG list key need transformation (prefix, reformat)?",
      yes: "→ Key Transformer",
      no: "→ Key Transformer still (always needed for list nodes)",
      yesC: "#06b6d4",
    },
    {
      q: "Does the leaf value format differ between OC and SONiC?",
      yes: "→ Field Transformer",
      no: "→ Direct Mapping (field-name only)",
      yesC: "#f59e0b",
    },
    {
      q: "Do you need input validation or cross-field computation?",
      yes: "→ Pre/Post Transformer (alongside field transformer)",
      no: "You're done!",
      yesC: "#ec4899",
    },
  ];

  return (
    <section data-section="decision-tree" id="decision-tree" className="scroll-mt-20">
      <h2>8. Decision Tree — Which Transformer to Use</h2>
      <p>
        Work through these questions in order for each YANG node you need to annotate.
      </p>

      <div className="my-8 space-y-3">
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <div className="px-5 py-3 flex items-center gap-3" style={{ background: "var(--bg-tertiary)" }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: "var(--accent-blue)" }}>{i + 1}</span>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Q: {node.q}</span>
            </div>
            <div className="px-5 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ background: "var(--bg-card)" }}>
              <div className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: `${node.yesC}08`, border: `1px solid ${node.yesC}20` }}>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: node.yesC }}>YES</span>
                <span className="text-xs font-semibold" style={{ color: node.yesC }}>{node.yes}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: "var(--bg-code)", border: "1px solid var(--border-primary)" }}>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>NO</span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{node.no}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick comparison table */}
      <div className="rounded-2xl border overflow-hidden my-6" style={{ borderColor: "var(--border-primary)" }}>
        <div className="px-5 py-3" style={{ background: "var(--bg-tertiary)" }}>
          <div className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>🔀 All Transformer Types — Side-by-Side Comparison</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-primary)", background: "var(--bg-card)" }}>
                {["Type", "Applied On", "Annotation Key", "Go Type", "Returns", "Complexity"].map(h => (
                  <th key={h} className="px-4 py-2 text-left font-semibold whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { type: "Direct", on: "leaf", ann: "field-name", go: "—", ret: "n/a", cx: "⭐", c: "#10b981" },
                { type: "Key", on: "list", ann: "key-transformer", go: "KeyXfmrFunc", ret: "string", cx: "⭐⭐", c: "#06b6d4" },
                { type: "Field", on: "leaf", ann: "field-transformer", go: "FieldXfmrFunc", ret: "map[string]string", cx: "⭐⭐", c: "#f59e0b" },
                { type: "Table", on: "list/container", ann: "table-transformer", go: "TableXfmrFunc", ret: "[]string", cx: "⭐⭐⭐", c: "#8b5cf6" },
                { type: "Subtree", on: "any", ann: "subtree-transformer", go: "SubtreeXfmrFunc", ret: "map[string]map[string]db.Value", cx: "⭐⭐⭐⭐⭐", c: "#ef4444" },
                { type: "Pre", on: "list/container", ann: "pre-transformer", go: "PreXfmrFunc", ret: "error", cx: "⭐⭐⭐", c: "#f97316" },
                { type: "Post", on: "list/container", ann: "post-transformer", go: "PostXfmrFunc", ret: "error", cx: "⭐⭐⭐", c: "#ec4899" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-secondary)", background: "var(--bg-card)" }}>
                  <td className="px-4 py-2.5">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded" style={{ background: `${row.c}15`, color: row.c }}>{row.type}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[10px]" style={{ color: "var(--text-tertiary)" }}>{row.on}</td>
                  <td className="px-4 py-2.5 font-mono text-[10px]" style={{ color: "var(--text-secondary)" }}>oc-ext:{row.ann}</td>
                  <td className="px-4 py-2.5 font-mono text-[10px]" style={{ color: row.c }}>{row.go}</td>
                  <td className="px-4 py-2.5 font-mono text-[10px]" style={{ color: "var(--text-tertiary)" }}>{row.ret}</td>
                  <td className="px-4 py-2.5 text-[10px]">{row.cx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
