"use client";
import React from "react";
import { motion } from "framer-motion";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import MappingVisual from "@/components/cards/MappingVisual";
import WPageNav from "@/components/guide/WPageNav";

export default function TableTransformerDetailPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="table-transformer">
        <h2 className="!mt-0">Table Transformer</h2>
        <p>Used <strong>instead of</strong> a fixed <code>table-name</code> when different values
          of the same path map to different Redis tables. Runs first — before the key transformer.</p>

        <div className="rounded-xl border p-4 my-5 not-prose" style={{ borderColor: "#8b5cf630", background: "#8b5cf605" }}>
          <div className="text-xs font-bold mb-2" style={{ color: "#8b5cf6" }}>📌 Function Signature</div>
          <pre className="text-[11px] p-3 rounded-lg overflow-x-auto" style={{ background: "var(--bg-code)", color: "var(--text-primary)" }}>
{`type TableXfmrFunc func(inParams XfmrParams) ([]string, error)
//                                                  ↑ list of Redis table names`}
          </pre>
        </div>

        <MappingVisual
          title="Dynamic Table Routing by Interface Name"
          leftTitle="Interface Name"
          rightTitle="Redis Table Returned"
          leftColor="#8b5cf6"
          rightColor="#10b981"
          rows={[
            { left: "Ethernet0", right: '[]string{"PORT"}' },
            { left: "Vlan100", right: '[]string{"VLAN"}' },
            { left: "PortChannel1", right: '[]string{"PORTCHANNEL"}' },
            { left: "Loopback0", right: '[]string{"LOOPBACK_INTERFACE"}' },
          ]}
        />

        <AnnotatedCodeBlock
          title="intf_table_xfmr.go"
          language="go"
          lines={[
            { code: "var intf_table_xfmr TableXfmrFunc = func(", annotation: "Returns []string — list of tables" },
            { code: "    inParams XfmrParams," },
            { code: ") ([]string, error) {" },
            { code: '    intfName := NewPathInfo(inParams.uri).Var("name")' },
            { code: "    switch {" },
            { code: '    case strings.HasPrefix(intfName, "Ethernet"):', highlight: true, color: "#3b82f6" },
            { code: '        return []string{"PORT"}, nil', highlight: true, color: "#3b82f6" },
            { code: '    case strings.HasPrefix(intfName, "Vlan"):', highlight: true, color: "#8b5cf6" },
            { code: '        return []string{"VLAN"}, nil', highlight: true, color: "#8b5cf6" },
            { code: '    case strings.HasPrefix(intfName, "PortChannel"):', highlight: true, color: "#06b6d4" },
            { code: '        return []string{"PORTCHANNEL"}, nil', highlight: true, color: "#06b6d4" },
            { code: "    default:" },
            { code: '        return nil, fmt.Errorf("unknown: %s", intfName)', annotation: "Error for unknown types" },
            { code: "    }" },
            { code: "}" },
          ]}
        />

        <div className="rounded-xl border p-4 not-prose" style={{ borderColor: "#ef444430", background: "#ef444404" }}>
          <div className="text-xs font-bold mb-1" style={{ color: "#ef4444" }}>⚠️ Never use both table-name AND table-transformer</div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            They are mutually exclusive. Remove <code>table-name</code> from the annotation when using <code>table-transformer</code>.
          </div>
        </div>
      </section>
      <WPageNav
        prev={{ title: "Field Transformer", slug: "transformer-code/field-transformer" }}
        next={{ title: "Return Types & Results", slug: "transformer-code/return-types" }}
      />
    </motion.div>
  );
}
