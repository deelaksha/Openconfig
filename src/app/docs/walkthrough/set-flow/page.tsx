"use client";
import React from "react";
import { motion } from "framer-motion";
import StepByStep from "@/components/cards/StepByStep";
import FlowDiagram from "@/components/cards/FlowDiagram";
import WPageNav from "@/components/guide/WPageNav";

export default function SetFlowPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="set-flow">
        <h2 className="!mt-0">5. SET Flow — OpenConfig → Redis</h2>
        <p>The complete write path when a client sends <code>enabled = true</code> for Ethernet0.</p>
        <StepByStep
          steps={[
            { title: "gNMI Client sends SET", description: "An automation tool sends gNMI SET with path and value.", before: "/interfaces/interface[name=Ethernet0]/config/enabled", after: "value = true", color: "#3b82f6" },
            { title: "Translib validates YANG", description: "Checks: Does /config/enabled exist? Is 'true' a valid boolean?", color: "#8b5cf6" },
            { title: "Annotation engine resolves mapping", description: "Reads annotation: table=PORT, key-xfmr=intf_tbl_key_xfmr, field=admin_status, field-xfmr=intf_enabled_xfmr", before: "deviation /oc-if:.../enabled", after: "table: PORT, field: admin_status", color: "#06b6d4" },
            { title: "Key Transformer runs", description: "intf_tbl_key_xfmr extracts 'Ethernet0' from the path.", before: "interface[name=Ethernet0]", after: "Redis key: PORT|Ethernet0", color: "#f59e0b" },
            { title: "Field Transformer runs (SET)", description: "intf_enabled_xfmr sees oper=SET, converts boolean true → string 'up'.", before: "enabled = true (boolean)", after: 'admin_status = "up" (string)', color: "#ec4899" },
            { title: "DB Client writes to CONFIG_DB", description: 'Executes: HSET PORT|Ethernet0 admin_status "up" in Redis DB 4.', before: "HSET PORT|Ethernet0 admin_status", after: '"up" ✓ Written!', color: "#10b981" },
          ]}
        />
        <FlowDiagram
          title="SET Flow Summary"
          steps={[
            { label: "enabled", sublabel: "= true", color: "#3b82f6" },
            { label: "Validate", sublabel: "YANG check", color: "#8b5cf6" },
            { label: "Annotate", sublabel: "find mapping", color: "#06b6d4" },
            { label: "Key Xfmr", sublabel: "→ Ethernet0", color: "#f59e0b" },
            { label: "Field Xfmr", sublabel: 'true → "up"', color: "#ec4899" },
            { label: "Redis Write", sublabel: "HSET", color: "#10b981" },
          ]}
        />
      </section>
      <WPageNav prev={{ title: "Transformer Code", slug: "transformer-code" }} next={{ title: "GET Flow", slug: "get-flow" }} />
    </motion.div>
  );
}
