"use client";
import React from "react";
import { motion } from "framer-motion";
import MappingVisual from "@/components/cards/MappingVisual";
import WPageNav from "@/components/guide/WPageNav";

const extensions = [
  { name: "table-name", syntax: 'oc-ext:table-name "PORT";', what: "Tells Translib which Redis table to read/write", example: "PORT → Redis key prefix PORT|...", color: "#10b981" },
  { name: "field-name", syntax: 'oc-ext:field-name "admin_status";', what: "Tells Translib which Redis hash field to use", example: "admin_status → the field inside PORT|Ethernet0", color: "#8b5cf6" },
  { name: "key-transformer", syntax: 'oc-ext:key-transformer "intf_tbl_key_xfmr";', what: "Name of Go function that converts YANG list key → Redis key", example: "interface[name=Ethernet0] → Ethernet0", color: "#f59e0b" },
  { name: "field-transformer", syntax: 'oc-ext:field-transformer "intf_enabled_xfmr";', what: "Name of Go function that converts field values (both directions)", example: 'true → "up" (SET)  and  "up" → true (GET)', color: "#ef4444" },
  { name: "table-transformer", syntax: 'oc-ext:table-transformer "intf_table_xfmr";', what: "Dynamically decides Redis table at runtime (replaces table-name)", example: "Ethernet0 → PORT, Vlan100 → VLAN, Loopback0 → LOOPBACK", color: "#06b6d4" },
  { name: "subtree-transformer", syntax: 'oc-ext:subtree-transformer "acl_xfmr";', what: "Go fn owns the entire YANG branch — handles all mapping itself", example: "ACL set → writes ACL_TABLE + ACL_RULE in one function", color: "#ef4444" },
  { name: "db-name", syntax: 'oc-ext:db-name "APPL_DB";', what: "Specifies which Redis database to target (default: CONFIG_DB)", example: "CONFIG_DB (config), APPL_DB (oper state), STATE_DB (hw state)", color: "#3b82f6" },
  { name: "key-delimiter", syntax: 'oc-ext:key-delimiter "|";', what: "Override the separator character used in composite Redis keys", example: 'Default is | → "PORT|Ethernet0", can override to "/" etc.', color: "#ec4899" },
];

export default function ExtensionsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="extensions">
        <h2 className="!mt-0">3. Extensions (oc-ext)</h2>
        <p>
          Extensions are keywords defined in the <code>openconfig-extensions</code> module.
          They are the vocabulary the annotation uses to describe the mapping.
        </p>

        <div className="space-y-3 my-6 not-prose">
          {extensions.map((ext) => (
            <div key={ext.name} className="rounded-xl border overflow-hidden" style={{ borderColor: `${ext.color}25` }}>
              <div className="px-4 py-2 flex items-center gap-2" style={{ background: `${ext.color}10` }}>
                <code className="text-xs font-bold" style={{ color: ext.color }}>{ext.name}</code>
              </div>
              <div className="px-4 py-3 space-y-1.5" style={{ background: "var(--bg-card)" }}>
                <div className="font-mono text-[11px] px-2 py-1 rounded" style={{ background: "var(--bg-code)", color: "var(--text-primary)" }}>
                  {ext.syntax}
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  <strong>What:</strong> {ext.what}
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  <strong>Example:</strong> {ext.example}
                </div>
              </div>
            </div>
          ))}
        </div>

        <MappingVisual
          title="Which Redis Database?"
          leftTitle="Data Type"
          rightTitle="Target DB"
          leftColor="#8b5cf6"
          rightColor="#10b981"
          rows={[
            { left: "Config (e.g. enabled)", right: "CONFIG_DB (db 4)", label: "default" },
            { left: "Oper state (e.g. oper-status)", right: "APPL_DB (db 0)" },
            { left: "HW state (e.g. temperature)", right: "STATE_DB (db 6)" },
          ]}
        />
      </section>
      <WPageNav
        prev={{ title: "Annotation File", slug: "annotation-file" }}
        next={{ title: "Transformer Code", slug: "transformer-code" }}
      />
    </motion.div>
  );
}
