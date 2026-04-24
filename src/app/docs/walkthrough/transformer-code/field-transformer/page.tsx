"use client";
import React from "react";
import { motion } from "framer-motion";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import MappingVisual from "@/components/cards/MappingVisual";
import WPageNav from "@/components/guide/WPageNav";

export default function FieldTransformerDetailPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="field-transformer">
        <h2 className="!mt-0">Field Transformer</h2>
        <p>
          A field transformer converts the <strong>value</strong> of a leaf — bidirectionally.
          It handles both SET (OpenConfig → SONiC) and GET (SONiC → OpenConfig). It returns 
          a <code>map[string]string</code> of field-name to value pairs.
        </p>

        <div className="rounded-xl border p-4 my-5 not-prose" style={{ borderColor: "#f59e0b30", background: "#f59e0b05" }}>
          <div className="text-xs font-bold mb-2" style={{ color: "#f59e0b" }}>📌 Function Signature</div>
          <pre className="text-[11px] p-3 rounded-lg overflow-x-auto" style={{ background: "var(--bg-code)", color: "var(--text-primary)" }}>{`type FieldXfmrFunc func(inParams XfmrParams) (map[string]string, error)
//                                                  ↑ map of Redis field → Redis value
//
// SET direction: key = Redis field name  (e.g. "admin_status")
// GET direction: key = OC field name     (e.g. "enabled")`}</pre>
        </div>

        <MappingVisual
          title="SET Direction — OpenConfig → Redis"
          leftTitle="OpenConfig (inParams.param)"
          rightTitle='Result map["admin_status"]'
          leftColor="#3b82f6"
          rightColor="#10b981"
          rows={[
            { left: "enabled = true (boolean)", right: '"up"', label: "SET" },
            { left: "enabled = false (boolean)", right: '"down"', label: "SET" },
          ]}
        />
        <MappingVisual
          title="GET Direction — Redis → OpenConfig"
          leftTitle='inParams.param (Redis value)'
          rightTitle='Result map["enabled"]'
          leftColor="#10b981"
          rightColor="#3b82f6"
          rows={[
            { left: '"up"', right: '"true"', label: "GET" },
            { left: '"down"', right: '"false"', label: "GET" },
          ]}
        />

        <h3>Full Go Implementation</h3>
        <AnnotatedCodeBlock
          title="intf_enabled_xfmr.go"
          language="go"
          lines={[
            { code: "func init() {" },
            { code: '    XlateFuncBind("intf_enabled_xfmr", intf_enabled_xfmr)', annotation: "Register name — must match annotation exactly!", highlight: true, color: "#f59e0b" },
            { code: "}" },
            { code: "" },
            { code: "var intf_enabled_xfmr FieldXfmrFunc = func(", annotation: "FieldXfmrFunc — returns map[string]string" },
            { code: "    inParams XfmrParams,", annotation: ".oper tells you SET or GET, .param is the value" },
            { code: ") (map[string]string, error) {" },
            { code: "    result := make(map[string]string)" },
            { code: "" },
            { code: "    if inParams.oper == GET {", annotation: "GET = reading from Redis, converting to OC", highlight: true, color: "#3b82f6" },
            { code: "        adminStatus := inParams.param.(string)", annotation: 'Redis gave us "up" or "down"' },
            { code: '        if adminStatus == "up" {' },
            { code: '            result["enabled"] = "true"', annotation: '"up" → OC boolean true', highlight: true, color: "#10b981" },
            { code: "        } else {" },
            { code: '            result["enabled"] = "false"', annotation: '"down" → OC boolean false' },
            { code: "        }" },
            { code: "" },
            { code: "    } else {", annotation: "SET = writing to Redis from OC value", highlight: true, color: "#f59e0b" },
            { code: "        enabled := inParams.param.(bool)", annotation: "OC gave us a Go bool (true or false)" },
            { code: "        if enabled {" },
            { code: '            result["admin_status"] = "up"', annotation: 'true → Redis "up"', highlight: true, color: "#10b981" },
            { code: "        } else {" },
            { code: '            result["admin_status"] = "down"', annotation: 'false → Redis "down"' },
            { code: "        }" },
            { code: "    }" },
            { code: "" },
            { code: "    return result, nil", annotation: "Translib writes this map to Redis (SET) or uses it to build response (GET)" },
            { code: "}" },
          ]}
        />

        <div className="rounded-xl border p-4 not-prose" style={{ borderColor: "#ef444430", background: "#ef444404" }}>
          <div className="text-xs font-bold mb-2" style={{ color: "#ef4444" }}>⚠️ Common Mistake: Wrong Map Key Direction</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg p-3" style={{ background: "#10b98108", border: "1px solid #10b98120" }}>
              <div className="font-bold mb-1" style={{ color: "#10b981" }}>✓ Correct</div>
              <div style={{ color: "var(--text-secondary)" }}>
                <strong>SET:</strong> <code>result["admin_status"] = "up"</code><br/>
                (Redis field name as key)<br/><br/>
                <strong>GET:</strong> <code>result["enabled"] = "true"</code><br/>
                (OC field name as key)
              </div>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#ef444408", border: "1px solid #ef444420" }}>
              <div className="font-bold mb-1" style={{ color: "#ef4444" }}>✗ Wrong</div>
              <div style={{ color: "var(--text-secondary)" }}>
                <strong>SET:</strong> <code>result["enabled"] = "up"</code><br/>
                (OC name used in SET = won't write correctly)<br/><br/>
                <strong>GET:</strong> <code>result["admin_status"] = "true"</code><br/>
                (Redis name used in GET = OC response broken)
              </div>
            </div>
          </div>
        </div>
      </section>
      <WPageNav
        prev={{ title: "Key Transformer", slug: "transformer-code/key-transformer" }}
        next={{ title: "Table Transformer", slug: "transformer-code/table-transformer" }}
      />
    </motion.div>
  );
}
