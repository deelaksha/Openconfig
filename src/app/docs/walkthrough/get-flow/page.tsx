"use client";
import React from "react";
import { motion } from "framer-motion";
import StepByStep from "@/components/cards/StepByStep";
import FlowDiagram from "@/components/cards/FlowDiagram";
import WPageNav from "@/components/guide/WPageNav";

export default function GetFlowPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="get-flow">
        <h2 className="!mt-0">6. GET Flow — Redis → OpenConfig</h2>
        <p>The read path is the <strong>exact reverse</strong>. Reading enabled status of Ethernet0:</p>
        <StepByStep
          steps={[
            { title: "gNMI Client sends GET", description: "Client asks: 'What is the enabled status of Ethernet0?'", before: "GET /interfaces/interface[name=Ethernet0]/config/enabled", color: "#3b82f6" },
            { title: "Annotation engine resolves mapping", description: "Same annotation as SET: table=PORT, key-xfmr, field=admin_status, field-xfmr.", after: "table: PORT, field: admin_status", color: "#06b6d4" },
            { title: "Key Transformer resolves Redis key", description: "intf_tbl_key_xfmr returns 'Ethernet0', so we read from PORT|Ethernet0.", before: "interface[name=Ethernet0]", after: "Read from: PORT|Ethernet0", color: "#f59e0b" },
            { title: "Redis read: HGET", description: 'DB Client executes: HGET PORT|Ethernet0 admin_status → returns "up"', before: "HGET PORT|Ethernet0 admin_status", after: '"up"', color: "#10b981" },
            { title: "Field Transformer runs (GET)", description: 'intf_enabled_xfmr sees oper=GET, converts "up" back → true.', before: 'admin_status = "up"', after: "enabled = true", color: "#ec4899" },
            { title: "Response sent to client", description: "gNMI server sends back: enabled = true.", after: '{ "enabled": true } ✓', color: "#3b82f6" },
          ]}
        />
        <FlowDiagram
          title="GET Flow Summary (reverse direction)"
          steps={[
            { label: "GET Request", sublabel: "client asks", color: "#3b82f6" },
            { label: "Annotate", sublabel: "find mapping", color: "#06b6d4" },
            { label: "Key Xfmr", sublabel: "→ Ethernet0", color: "#f59e0b" },
            { label: "Redis Read", sublabel: 'HGET → "up"', color: "#10b981" },
            { label: "Field Xfmr", sublabel: '"up" → true', color: "#ec4899" },
            { label: "Response", sublabel: "enabled=true", color: "#3b82f6" },
          ]}
        />
      </section>
      <WPageNav prev={{ title: "SET Flow", slug: "set-flow" }} next={{ title: "Redis DB Output", slug: "redis-output" }} />
    </motion.div>
  );
}
