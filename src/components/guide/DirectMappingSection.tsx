"use client";
import React from "react";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import MappingVisual from "@/components/cards/MappingVisual";

export default function DirectMappingSection() {
  return (
    <section data-section="direct-mapping" id="direct-mapping" className="scroll-mt-20">
      <h2>2. Type 1 — Direct Mapping (No Transformer Needed)</h2>
      <p>
        The simplest case: the OpenConfig field name and value format are <strong>identical</strong> to
        the Redis field. No Go code needed — just declare <code>table-name</code> and <code>field-name</code>.
        Translib copies the value verbatim.
      </p>

      <div className="rounded-2xl border p-4 my-4" style={{ borderColor: "#10b98130", background: "#10b98105" }}>
        <div className="text-xs font-bold mb-2" style={{ color: "#10b981" }}>✅ Use Direct Mapping when:</div>
        <ul className="text-xs space-y-1" style={{ color: "var(--text-secondary)" }}>
          <li>• The OpenConfig leaf name is the same as the Redis field (or you rename it with <code>field-name</code>)</li>
          <li>• The value type and format are the same — no conversion needed (e.g. both use an integer MTU)</li>
          <li>• No complex key construction — list key maps directly to a Redis key string</li>
        </ul>
      </div>

      <h3>Annotation File</h3>
      <AnnotatedCodeBlock
        title="openconfig-interfaces-annot.yang — Direct Mapping (mtu leaf)"
        language="yang"
        lines={[
          { code: "module openconfig-interfaces-annot {", annotation: "Annotation module" },
          { code: "  import openconfig-interfaces { prefix oc-if; }", annotation: "Import model being annotated", highlight: true, color: "#3b82f6" },
          { code: "  import openconfig-extensions { prefix oc-ext; }", annotation: "Import extension keywords", highlight: true, color: "#8b5cf6" },
          { code: "" },
          { code: "  // Step 1 — Map the LIST node → tell Translib which Redis table", annotation: "ALWAYS annotate the list node first" },
          { code: "  deviation /oc-if:interfaces/oc-if:interface {", annotation: "Target: the interface list node", highlight: true, color: "#06b6d4" },
          { code: "    deviate add {" },
          { code: "      oc-ext:table-name \"PORT\";", annotation: "Redis table = PORT (static, no transformer)", highlight: true, color: "#10b981" },
          { code: "      oc-ext:key-transformer \"intf_tbl_key_xfmr\";", annotation: "Still need key xfmr to extract 'Ethernet0'" },
          { code: "    }" },
          { code: "  }" },
          { code: "" },
          { code: "  // Step 2 — Map the LEAF → just give Redis field name, no value conversion" },
          { code: "  deviation /oc-if:interfaces/oc-if:interface", annotation: "Same list path..." },
          { code: "            /oc-if:config/oc-if:mtu {", annotation: "...targeting the mtu leaf", highlight: true, color: "#06b6d4" },
          { code: "    deviate add {" },
          { code: "      oc-ext:field-name \"mtu\";", annotation: "Redis field = 'mtu' — value copied as-is", highlight: true, color: "#10b981" },
          { code: "      // NO field-transformer needed!", annotation: "Translib converts uint16 → string automatically" },
          { code: "    }" },
          { code: "  }" },
          { code: "}" },
        ]}
      />

      <h3>What Happens at Runtime</h3>
      <MappingVisual
        title="Direct Mapping: Value flows with no conversion"
        leftTitle="OpenConfig SET value"
        rightTitle="Redis field value"
        leftColor="#3b82f6"
        rightColor="#10b981"
        rows={[
          { left: "mtu = 9100 (uint16)", right: "mtu: \"9100\" (string)" },
          { left: "mtu = 1500 (uint16)", right: "mtu: \"1500\" (string)" },
          { left: "description = \"uplink\"", right: "description: \"uplink\"" },
        ]}
      />

      <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
        <div className="text-xs font-bold mb-3" style={{ color: "var(--text-primary)" }}>📦 Resulting Redis entry after SET mtu=9100</div>
        <div className="font-mono text-xs rounded-lg p-4" style={{ background: "var(--bg-code)" }}>
          <div className="font-bold mb-2" style={{ color: "#10b981" }}>PORT|Ethernet0</div>
          <div style={{ color: "#3b82f6" }}>mtu<span style={{ color: "var(--text-secondary)" }}>: &quot;9100&quot;</span>
            <span className="ml-2 text-[10px] italic" style={{ color: "var(--text-tertiary)" }}>← direct from annotation, no Go code</span>
          </div>
          <div style={{ color: "var(--text-tertiary)" }}>admin_status: &quot;up&quot;</div>
          <div style={{ color: "var(--text-tertiary)" }}>speed: &quot;40000&quot;</div>
        </div>
      </div>

      <div className="rounded-2xl border p-4 my-4" style={{ borderColor: "#ef444430", background: "#ef444405" }}>
        <div className="text-xs font-bold mb-2" style={{ color: "#ef4444" }}>⚠️ Common mistake with direct mapping</div>
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
          If the OpenConfig field is named <code>mtu</code> but Redis stores it as <code>MTU</code> (uppercase),
          you MUST use <code>oc-ext:field-name &quot;MTU&quot;</code>. Without it, Translib will write to
          a field called <code>mtu</code> (lowercase) which may not match what SONiC expects.
        </div>
      </div>
    </section>
  );
}
