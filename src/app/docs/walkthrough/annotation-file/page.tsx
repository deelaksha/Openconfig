"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import WPageNav from "@/components/guide/WPageNav";

export default function AnnotationFilePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="annotation-file">
        <h2 className="!mt-0">2. The Annotation File</h2>
        <p>
          The annotation file is a <strong>separate YANG file</strong> that adds mapping metadata
          to OpenConfig paths using <code>deviation</code> blocks. It tells Translib:
          &ldquo;when you see this path, go to this Redis table and field.&rdquo;
        </p>

        <AnnotatedCodeBlock
          title="openconfig-interfaces-annot.yang"
          language="yang"
          lines={[
            { code: "module openconfig-interfaces-annot {", annotation: "Annotation module name" },
            { code: "" },
            { code: "  import openconfig-interfaces { prefix oc-if; }", annotation: "Import the model we're annotating", highlight: true, color: "#3b82f6" },
            { code: "  import openconfig-extensions { prefix oc-ext; }", annotation: "Import the mapping extensions", highlight: true, color: "#8b5cf6" },
            { code: "" },
            { code: "  // Map the interface list node", annotation: "Comment: what this block does" },
            { code: "  deviation /oc-if:interfaces/oc-if:interface {", annotation: "Target: the list node in the YANG tree", highlight: true, color: "#06b6d4" },
            { code: "    deviate add {", annotation: "'add' = attach new metadata" },
            { code: '      oc-ext:table-name "PORT";', annotation: "→ Redis table = PORT", highlight: true, color: "#10b981" },
            { code: '      oc-ext:key-transformer "intf_tbl_key_xfmr";', annotation: "→ Go function to convert the key", highlight: true, color: "#f59e0b" },
            { code: "    }" },
            { code: "  }" },
            { code: "" },
            { code: "  // Map the 'enabled' leaf", annotation: "Now map the specific leaf" },
            { code: "  deviation /oc-if:interfaces/oc-if:interface", annotation: "Full path to the leaf..." },
            { code: "            /oc-if:config/oc-if:enabled {", annotation: "...must include every node with prefix", highlight: true, color: "#06b6d4" },
            { code: "    deviate add {" },
            { code: '      oc-ext:field-name "admin_status";', annotation: "→ Redis field = admin_status", highlight: true, color: "#10b981" },
            { code: '      oc-ext:field-transformer "intf_enabled_xfmr";', annotation: '→ Go function: true ↔ "up"', highlight: true, color: "#f59e0b" },
            { code: "    }" },
            { code: "  }" },
            { code: "}" },
          ]}
        />

        <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <h4 className="text-sm font-semibold mb-4 !mt-0" style={{ color: "var(--text-primary)" }}>📋 What each annotation decides</h4>
          <div className="space-y-2">
            {[
              { question: "Which Redis table?", answer: "PORT", source: "table-name", color: "#10b981" },
              { question: "Which Redis key?", answer: "intf_tbl_key_xfmr(Ethernet0) → Ethernet0", source: "key-transformer", color: "#f59e0b" },
              { question: "Which Redis field?", answer: "admin_status", source: "field-name", color: "#8b5cf6" },
              { question: "How to convert value?", answer: 'intf_enabled_xfmr(true) → "up"', source: "field-transformer", color: "#ef4444" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2"
                style={{ background: `${item.color}06`, border: `1px solid ${item.color}15` }}>
                <div className="text-xs font-medium shrink-0 w-36" style={{ color: "var(--text-secondary)" }}>{item.question}</div>
                <div className="text-xs font-mono font-semibold" style={{ color: item.color }}>{item.answer}</div>
                <div className="ml-auto text-[9px] px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: `${item.color}12`, color: item.color }}>
                  {item.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Link
        href="/docs/annotation-guide"
        className="flex items-center gap-4 rounded-2xl border p-5 my-6 group transition-all hover:shadow-md not-prose"
        style={{ borderColor: "#8b5cf625", background: "#8b5cf605" }}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: "#8b5cf612" }}>
          📝
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold" style={{ color: "#8b5cf6" }}>Annotation Guide</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#8b5cf615", color: "#8b5cf6" }}>Full Reference</span>
          </div>
          <p className="text-xs leading-relaxed !mt-0 !mb-0" style={{ color: "var(--text-tertiary)" }}>
            Want the complete breakdown of every annotation type? The Annotation Guide covers all transformer
            types (Direct, Key, Field, Table, Subtree, Pre/Post), the decision tree for picking the right one,
            Go implementation patterns, and a quick-reference cheatsheet.
          </p>
        </div>
        <div className="text-sm font-bold shrink-0" style={{ color: "#8b5cf6" }}>→</div>
      </Link>

      <WPageNav
        prev={{ title: "YANG Model", slug: "yang-model" }}
        next={{ title: "Extensions", slug: "extensions" }}
      />
    </motion.div>
  );
}
