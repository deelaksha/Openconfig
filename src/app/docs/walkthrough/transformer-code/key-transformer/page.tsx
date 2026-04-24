"use client";
import React from "react";
import { motion } from "framer-motion";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import MappingVisual from "@/components/cards/MappingVisual";
import WPageNav from "@/components/guide/WPageNav";

export default function KeyTransformerDetailPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="key-transformer">
        <h2 className="!mt-0">Key Transformer</h2>
        <p>
          A key transformer extracts a YANG list key from the gNMI path and returns it as the 
          <strong> Redis key string</strong>. It is called once per list node before any field transformers run.
        </p>

        <div className="rounded-xl border p-4 my-5 not-prose" style={{ borderColor: "#06b6d430", background: "#06b6d405" }}>
          <div className="text-xs font-bold mb-2" style={{ color: "#06b6d4" }}>📌 Function Signature</div>
          <pre className="text-[11px] p-3 rounded-lg overflow-x-auto" style={{ background: "var(--bg-code)", color: "var(--text-primary)" }}>{`type KeyXfmrFunc func(inParams XfmrParams) (string, error)
//                                                  ↑ returns a single string — the Redis key`}</pre>
        </div>

        <MappingVisual
          title="What the Key Transformer Converts"
          leftTitle="YANG List Key (in gNMI path)"
          rightTitle="Redis Key"
          leftColor="#3b82f6"
          rightColor="#10b981"
          rows={[
            { left: "interface[name=Ethernet0]", right: "PORT|Ethernet0" },
            { left: "interface[name=Ethernet4]", right: "PORT|Ethernet4" },
            { left: "interface[name=Loopback0]", right: "PORT|Loopback0" },
            { left: "vlan[vlan-id=100]", right: "VLAN|Vlan100" },
          ]}
        />

        <h3>Full Go Implementation</h3>
        <AnnotatedCodeBlock
          title="intf_tbl_key_xfmr.go"
          language="go"
          lines={[
            { code: "func init() {", annotation: "Runs once at startup" },
            { code: '    XlateFuncBind("intf_tbl_key_xfmr", intf_tbl_key_xfmr)', annotation: "Register name → function", highlight: true, color: "#f59e0b" },
            { code: "}" },
            { code: "" },
            { code: "// KeyXfmrFunc signature: takes params, returns string key", annotation: "Return type is string — ONE key per call" },
            { code: "var intf_tbl_key_xfmr KeyXfmrFunc = func(", highlight: true, color: "#06b6d4" },
            { code: "    inParams XfmrParams,", annotation: "Receives the gNMI path and request context" },
            { code: ") (string, error) {", annotation: "Returns: Redis key string" },
            { code: "" },
            { code: "    // Parse the URI to extract YANG list key variables", annotation: "NewPathInfo parses the gNMI path" },
            { code: "    pathInfo := NewPathInfo(inParams.uri)" },
            { code: '    intfName := pathInfo.Var("name")', annotation: 'Extract the [name=Ethernet0] value', highlight: true, color: "#3b82f6" },
            { code: "" },
            { code: '    if intfName == "" {', annotation: "Always validate — empty name = bad request" },
            { code: '        return "", errors.New("interface name is empty")' },
            { code: "    }" },
            { code: "" },
            { code: "    // Return JUST the name — Translib prepends the table name automatically", annotation: "PORT + | + Ethernet0 = PORT|Ethernet0" },
            { code: "    return intfName, nil", annotation: 'Returns "Ethernet0" — Translib builds "PORT|Ethernet0"', highlight: true, color: "#10b981" },
            { code: "}" },
          ]}
        />

        <h3>When is the Key Transformer Called?</h3>
        <div className="space-y-2 not-prose">
          {[
            { title: "Called on SET", detail: "Called first, before field transformers. Result is the Redis key for HSET.", color: "#f59e0b" },
            { title: "Called on GET", detail: "Called to determine which Redis key to HGET. Must return the same key as SET.", color: "#3b82f6" },
            { title: "Called on DELETE", detail: "Called to know which Redis key to DEL. Critical: wrong key = wrong data deleted.", color: "#ef4444" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg px-4 py-3" style={{ background: `${item.color}06`, border: `1px solid ${item.color}15` }}>
              <div className="text-xs font-bold" style={{ color: item.color }}>{item.title}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </section>
      <WPageNav
        prev={{ title: "How Translib Calls Them", slug: "transformer-code/how-translib-calls" }}
        next={{ title: "Field Transformer", slug: "transformer-code/field-transformer" }}
      />
    </motion.div>
  );
}
