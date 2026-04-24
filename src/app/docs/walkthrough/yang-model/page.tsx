"use client";
import React from "react";
import { motion } from "framer-motion";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import WPageNav from "@/components/guide/WPageNav";

export default function YangModelPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="yang-model">
        <h2 className="!mt-0">1. The OpenConfig YANG Model</h2>
        <p>This is the <strong>source model</strong> — what a network engineer sees and interacts with.
          It defines an <code>enabled</code> leaf of type <code>boolean</code> inside the interface config container.</p>

        <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <h4 className="text-sm font-semibold mb-3 !mt-0" style={{ color: "var(--text-primary)" }}>🌳 YANG Tree Structure</h4>
          <div className="font-mono text-xs leading-7" style={{ color: "var(--text-secondary)" }}>
            <div style={{ color: "var(--text-tertiary)" }}>module: openconfig-interfaces</div>
            <div className="mt-2">/interfaces</div>
            <div className="ml-4">└── /interface <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#f59e0b15", color: "#f59e0b" }}>list, key: name</span></div>
            <div className="ml-8">└── /config</div>
            <div className="ml-12 flex items-center gap-2">
              <span>├── name</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#8b5cf615", color: "#8b5cf6" }}>string</span>
            </div>
            <div className="ml-12 flex items-center gap-2">
              <span style={{ color: "#3b82f6", fontWeight: 600 }}>├── enabled</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#3b82f615", color: "#3b82f6" }}>boolean ← OUR LEAF</span>
            </div>
            <div className="ml-12 flex items-center gap-2">
              <span>├── mtu</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#8b5cf615", color: "#8b5cf6" }}>uint16</span>
            </div>
            <div className="ml-12 flex items-center gap-2">
              <span>└── description</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#8b5cf615", color: "#8b5cf6" }}>string</span>
            </div>
          </div>
        </div>

        <AnnotatedCodeBlock
          title="openconfig-interfaces.yang"
          language="yang"
          lines={[
            { code: "module openconfig-interfaces {", annotation: "Module name — imported by annotation" },
            { code: '  namespace "http://openconfig.net/yang/interfaces";', annotation: "Unique namespace URI" },
            { code: "  prefix oc-if;", annotation: "Short prefix used in paths", highlight: true, color: "#3b82f6" },
            { code: "" },
            { code: "  grouping interface-config {" },
            { code: "    leaf enabled {", annotation: "This is the leaf we're mapping", highlight: true, color: "#3b82f6" },
            { code: "      type boolean;", annotation: "OpenConfig type: true or false", highlight: true, color: "#10b981" },
            { code: '      default "true";', annotation: "Defaults to enabled" },
            { code: "      description" },
            { code: '        "Desired state of the interface.";' },
            { code: "    }" },
            { code: "  }" },
            { code: "}" },
          ]}
        />

        <div className="rounded-xl border p-4 my-5" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <div className="text-xs font-bold mb-2" style={{ color: "var(--text-primary)" }}>🔗 The gNMI path to this leaf</div>
          <code className="text-[11px] break-all" style={{ color: "var(--accent-blue)" }}>
            /openconfig-interfaces:interfaces/interface[name=Ethernet0]/config/enabled
          </code>
        </div>
      </section>
      <WPageNav
        prev={{ title: "Overview", slug: "" }}
        next={{ title: "Annotation File", slug: "annotation-file" }}
      />
    </motion.div>
  );
}
