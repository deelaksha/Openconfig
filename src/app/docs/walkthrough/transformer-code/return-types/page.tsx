"use client";
import React from "react";
import { motion } from "framer-motion";
import WPageNav from "@/components/guide/WPageNav";

const types = [
  {
    name: "KeyXfmrFunc",
    ext: "key-transformer",
    signature: "func(XfmrParams) (string, error)",
    returns: "A single string — the Redis key segment",
    howUsed: 'Translib combines with table: "PORT" + "|" + "Ethernet0" = "PORT|Ethernet0"',
    setExample: '"Ethernet0"',
    getExample: '"Ethernet0"',
    color: "#06b6d4",
  },
  {
    name: "FieldXfmrFunc",
    ext: "field-transformer",
    signature: "func(XfmrParams) (map[string]string, error)",
    returns: "Map of field→value. SET: Redis field name as key. GET: OC field name as key.",
    howUsed: 'SET → Translib writes each entry as HSET table|key field value\nGET → Translib uses result to build OpenConfig response',
    setExample: '{"admin_status": "up"}',
    getExample: '{"enabled": "true"}',
    color: "#f59e0b",
  },
  {
    name: "TableXfmrFunc",
    ext: "table-transformer",
    signature: "func(XfmrParams) ([]string, error)",
    returns: 'List of Redis table names. Usually one: []string{"PORT"}',
    howUsed: "Translib uses the first table for HSET. Multiple tables possible for subtree.",
    setExample: '[]string{"PORT"}',
    getExample: '[]string{"PORT"}',
    color: "#8b5cf6",
  },
  {
    name: "SubTreeXfmrFunc",
    ext: "subtree-transformer",
    signature: "func(XfmrParams) (map[string]map[string]db.Value, error)",
    returns: "Full Redis write structure: map[table][key] → fields map",
    howUsed: "Translib writes every entry in the returned map to Redis in one transaction.",
    setExample: '{"ACL_TABLE": {"MY_ACL": {field: "DATAACL"}}, "ACL_RULE": {"MY_ACL|SEQ10": {...}}}',
    getExample: "Reads from Redis itself using inParams.dbs",
    color: "#ef4444",
  },
];

export default function ReturnTypesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="return-types">
        <h2 className="!mt-0">Return Types & Results</h2>
        <p>
          Each transformer type returns a different data structure. Understanding what Translib
          expects to receive — and how it uses the result — is critical to writing correct transformers.
        </p>

        <div className="space-y-5 not-prose">
          {types.map((t) => (
            <div key={t.name} className="rounded-xl border overflow-hidden" style={{ borderColor: `${t.color}30` }}>
              <div className="px-4 py-3 flex flex-wrap items-center gap-3" style={{ background: `${t.color}10` }}>
                <code className="text-sm font-bold" style={{ color: t.color }}>{t.name}</code>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono"
                  style={{ background: `${t.color}15`, color: t.color }}>
                  oc-ext:{t.ext}
                </span>
              </div>
              <div className="p-4 space-y-3" style={{ background: "var(--bg-card)" }}>
                <div className="text-[11px] font-mono p-2 rounded-lg overflow-x-auto" style={{ background: "var(--bg-code)", color: "var(--text-primary)" }}>
                  {t.signature}
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Returns:</strong> {t.returns}
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>How Translib uses it:</strong>{" "}
                  <span className="font-mono text-[10px]">{t.howUsed}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="rounded-lg p-2.5 text-[10px] font-mono" style={{ background: "#f59e0b08", border: "1px solid #f59e0b20" }}>
                    <div className="text-[9px] font-bold mb-1" style={{ color: "#f59e0b" }}>SET result example</div>
                    <span style={{ color: "var(--text-secondary)" }}>{t.setExample}</span>
                  </div>
                  <div className="rounded-lg p-2.5 text-[10px] font-mono" style={{ background: "#3b82f608", border: "1px solid #3b82f620" }}>
                    <div className="text-[9px] font-bold mb-1" style={{ color: "#3b82f6" }}>GET result example</div>
                    <span style={{ color: "var(--text-secondary)" }}>{t.getExample}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <WPageNav
        prev={{ title: "Table Transformer", slug: "transformer-code/table-transformer" }}
        next={{ title: "SET Flow", slug: "set-flow" }}
      />
    </motion.div>
  );
}
