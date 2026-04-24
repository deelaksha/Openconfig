"use client";
import React from "react";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import MappingVisual from "@/components/cards/MappingVisual";
import DataFlowTrace from "@/components/guide/DataFlowTrace";

export default function FieldXfmrSection() {
  return (
    <section data-section="field-transformer" id="field-transformer" className="scroll-mt-20">
      <h2>4. Type 3 — Field Transformer</h2>
      <p>
        A Field Transformer converts a <strong>single leaf value</strong> between OpenConfig format
        and SONiC/Redis format. It is <strong>bidirectional</strong> — the same function handles
        both <code>SET</code> (write) and <code>GET</code> (read) using <code>inParams.oper</code>.
      </p>

      <div className="rounded-2xl border p-4 my-4" style={{ borderColor: "#f59e0b30", background: "#f59e0b05" }}>
        <div className="text-xs font-bold mb-2" style={{ color: "#f59e0b" }}>✅ Use Field Transformer when:</div>
        <ul className="text-xs space-y-1" style={{ color: "var(--text-secondary)" }}>
          <li>• Value type differs: OpenConfig boolean → SONiC string (&quot;up&quot;/&quot;down&quot;)</li>
          <li>• Value format differs: OpenConfig enum (FULL_DUPLEX) → SONiC string (&quot;full&quot;)</li>
          <li>• Value needs computation: OpenConfig speed Mbps → SONiC speed bps (*1000)</li>
          <li>• One OpenConfig leaf maps to multiple Redis fields (return map with multiple entries)</li>
        </ul>
      </div>

      <MappingVisual
        title="Field Transformer: Bidirectional value conversion"
        leftTitle="OpenConfig value (SET)"
        rightTitle="Redis value (stored)"
        leftColor="#3b82f6"
        rightColor="#10b981"
        rows={[
          { left: "enabled = true", right: "admin_status = \"up\"" },
          { left: "enabled = false", right: "admin_status = \"down\"" },
        ]}
      />
      <MappingVisual
        title="Field Transformer: GET direction (reverse)"
        leftTitle="Redis value (stored)"
        rightTitle="OpenConfig value (returned)"
        leftColor="#10b981"
        rightColor="#3b82f6"
        rows={[
          { left: "admin_status = \"up\"", right: "enabled = true" },
          { left: "admin_status = \"down\"", right: "enabled = false" },
        ]}
      />

      <h3>Step 1 — The Annotation</h3>
      <AnnotatedCodeBlock
        title="openconfig-interfaces-annot.yang — field-transformer"
        language="yang"
        lines={[
          { code: "deviation /oc-if:interfaces/oc-if:interface", annotation: "List path prefix..." },
          { code: "          /oc-if:config/oc-if:enabled {", annotation: "...followed by leaf path. ALL nodes prefixed!", highlight: true, color: "#f59e0b" },
          { code: "  deviate add {" },
          { code: "    oc-ext:field-name \"admin_status\";", annotation: "Redis field name (different from OC leaf name)", highlight: true, color: "#10b981" },
          { code: "    oc-ext:field-transformer \"intf_enabled_xfmr\";", annotation: "Go function name — handles SET and GET", highlight: true, color: "#f59e0b" },
          { code: "  }" },
          { code: "}" },
        ]}
      />

      <h3>Step 2 — The Go Transformer (line by line)</h3>
      <AnnotatedCodeBlock
        title="transformer/intf_enabled_xfmr.go"
        language="go"
        lines={[
          { code: "package transformer" },
          { code: "" },
          { code: "func init() {" },
          { code: "    XlateFuncBind(\"intf_enabled_xfmr\", intf_enabled_xfmr)", annotation: "Name MUST match annotation string exactly!", highlight: true, color: "#f59e0b" },
          { code: "}" },
          { code: "" },
          { code: "// FieldXfmrFunc: receives params, returns map of field→value pairs", annotation: "Return type is a MAP — you can return multiple fields!" },
          { code: "var intf_enabled_xfmr FieldXfmrFunc = func(", annotation: "FieldXfmrFunc type — don't use KeyXfmrFunc by mistake", highlight: true, color: "#f59e0b" },
          { code: "    inParams XfmrParams,", },
          { code: ") (map[string]string, error) {", annotation: "Returns map[Redis_field_name]Redis_value", highlight: true, color: "#10b981" },
          { code: "    result := make(map[string]string)", annotation: "Initialize result map" },
          { code: "" },
          { code: "    // ── GET direction: Redis → OpenConfig ──────────────────", annotation: "Check oper to know which direction" },
          { code: "    if inParams.oper == GET {", annotation: "GET = someone is READING the interface enabled state", highlight: true, color: "#3b82f6" },
          { code: "        // inParams.param holds the Redis value (string from HGET)" },
          { code: "        adminStatus, ok := inParams.param.(string)", annotation: "Type-assert: Redis stores strings" },
          { code: "        if !ok { return nil, errors.New(\"invalid param type\") }", annotation: "Always guard the type assertion" },
          { code: "" },
          { code: "        if adminStatus == \"up\" {", highlight: true, color: "#3b82f6" },
          { code: "            result[\"enabled\"] = \"true\"", annotation: "\"up\" → OpenConfig boolean true", highlight: true, color: "#10b981" },
          { code: "        } else {" },
          { code: "            result[\"enabled\"] = \"false\"", annotation: "\"down\" or anything else → false" },
          { code: "        }" },
          { code: "" },
          { code: "    // ── SET direction: OpenConfig → Redis ──────────────────" },
          { code: "    } else {", annotation: "SET = someone is WRITING a new enabled value", highlight: true, color: "#f59e0b" },
          { code: "        // inParams.param holds the OpenConfig value (bool from the request)" },
          { code: "        enabled, ok := inParams.param.(bool)", annotation: "OpenConfig boolean — type-assert to bool" },
          { code: "        if !ok { return nil, errors.New(\"invalid param type\") }" },
          { code: "" },
          { code: "        if enabled {", highlight: true, color: "#f59e0b" },
          { code: "            result[\"admin_status\"] = \"up\"", annotation: "true → SONiC string \"up\"", highlight: true, color: "#10b981" },
          { code: "        } else {" },
          { code: "            result[\"admin_status\"] = \"down\"", annotation: "false → SONiC string \"down\"" },
          { code: "        }" },
          { code: "    }" },
          { code: "" },
          { code: "    return result, nil", annotation: "Return the populated map — Translib writes it to Redis", highlight: true, color: "#10b981" },
          { code: "}" },
        ]}
      />

      <h3>Advanced: One Leaf → Multiple Redis Fields</h3>
      <p>A field transformer can return <strong>multiple Redis fields</strong> from one OpenConfig leaf:</p>
      <AnnotatedCodeBlock
        title="transformer/intf_speed_xfmr.go — multiple output fields"
        language="go"
        lines={[
          { code: "var intf_speed_xfmr FieldXfmrFunc = func(inParams XfmrParams) (map[string]string, error) {" },
          { code: "    result := make(map[string]string)" },
          { code: "    if inParams.oper == SET {" },
          { code: "        speedMbps := inParams.param.(uint32)", annotation: "OpenConfig speed in Mbps" },
          { code: "        speedStr := fmt.Sprintf(\"%d\", speedMbps)", annotation: "Convert to string" },
          { code: "        result[\"speed\"] = speedStr", annotation: "Field 1: store speed value", highlight: true, color: "#10b981" },
          { code: "        result[\"autoneg\"] = \"off\"", annotation: "Field 2: also set autoneg (cross-field!)", highlight: true, color: "#10b981" },
          { code: "    }" },
          { code: "    return result, nil", annotation: "Returns 2 Redis fields from 1 OC leaf!" },
          { code: "}" },
        ]}
      />

      <div className="rounded-xl sm:rounded-2xl border p-3 sm:p-4 my-4 sm:my-6" style={{ borderColor: "#3b82f630", background: "#3b82f605" }}>
        <div className="text-xs font-bold mb-3" style={{ color: "#3b82f6" }}>📌 inParams.oper Values Reference</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { op: "GET", desc: "Read — Redis value comes IN via inParams.param", key: "result map keys = OC field names", c: "#3b82f6" },
            { op: "SET", desc: "Write — OC value comes IN via inParams.param", key: "result map keys = Redis field names", c: "#f59e0b" },
            { op: "DELETE", desc: "Delete operation — usually return empty map", key: "Translib handles the Redis DEL command", c: "#ef4444" },
            { op: "REPLACE", desc: "Replace (same as SET for most cases)", key: "Handle same as SET unless you need to clear old fields", c: "#8b5cf6" },
          ].map((item) => (
            <div key={item.op} className="rounded-lg p-2.5 sm:p-3" style={{ background: "var(--bg-code)", border: `1px solid ${item.c}20` }}>
              <code className="text-[11px] font-bold" style={{ color: item.c }}>{item.op}</code>
              <div className="text-[10px] mt-1" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
              <div className="text-[10px] mt-1 italic" style={{ color: "var(--text-tertiary)" }}>{item.key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DATA FLOW TRACES ── */}
      <h3>🔬 Data Flow Trace — intf_enabled_xfmr SET direction (hover any line)</h3>
      <p>Client sends: <code>SET /interfaces/interface[name=Ethernet0]/config/enabled = true</code></p>
      <DataFlowTrace
        title="intf_enabled_xfmr — SET direction (OC → Redis)"
        scenario="gNMI SET: enabled = true for Ethernet0"
        accent="#f59e0b"
        steps={[
          {
            line: "var intf_enabled_xfmr FieldXfmrFunc = func(inParams XfmrParams) (map[string]string, error) {",
            explain: "Translib calls this function. inParams.oper = SET, inParams.param = true (Go bool from the gNMI request body). The function must return a map of Redis field→value.",
            variable: "inParams.oper / inParams.param",
            value: "SET / true (bool)",
            color: "#f59e0b",
          },
          {
            line: "    result := make(map[string]string)",
            explain: "Create an empty Go map. This will be populated with Redis field names as keys and Redis string values as values. Currently: {}",
            variable: "result",
            value: "{}  ← empty map",
            color: "#8b5cf6",
          },
          {
            line: "    if inParams.oper == GET {",
            explain: "inParams.oper is SET, not GET. This entire block is SKIPPED. Execution jumps to the 'else' branch below.",
            variable: "inParams.oper == GET",
            value: "false → SKIP GET block",
            color: "#3b82f6",
          },
          {
            line: "    } else {   // SET direction",
            explain: "We enter this branch. inParams.param holds the OpenConfig value the client sent — a Go bool (true). We need to convert it to a Redis string.",
            variable: "branch taken",
            value: "SET branch",
            color: "#f59e0b",
            highlight: true,
          },
          {
            line: '        enabled, ok := inParams.param.(bool)',
            explain: "Type assertion: inParams.param is interface{}, we assert it is bool. Since the client sent a boolean, ok=true and enabled=true. If wrong type, ok=false and we return error.",
            variable: "enabled / ok",
            value: "true / true",
            color: "#f59e0b",
            highlight: true,
          },
          {
            line: "        if enabled {",
            explain: "enabled is true, so we take this branch and map to Redis string 'up'.",
            variable: "enabled",
            value: "true → take if branch",
            color: "#f59e0b",
          },
          {
            line: '            result["admin_status"] = "up"',
            explain: 'Put "admin_status"→"up" into the result map. The Redis field name is "admin_status" (from oc-ext:field-name in annotation). The value "up" is SONiC convention for enabled.',
            variable: "result",
            value: '{"admin_status": "up"}',
            color: "#10b981",
            highlight: true,
          },
          {
            line: "    return result, nil",
            explain: 'Returns {"admin_status": "up"} to Translib. Translib then writes: HSET PORT|Ethernet0 admin_status "up" into CONFIG_DB. nil = no error.',
            variable: "Redis write",
            value: 'HSET PORT|Ethernet0 admin_status "up"',
            color: "#10b981",
            highlight: true,
          },
        ]}
      />

      <h3>🔬 Data Flow Trace — intf_enabled_xfmr GET direction (hover any line)</h3>
      <p>Client sends: <code>GET /interfaces/interface[name=Ethernet0]/config/enabled</code></p>
      <DataFlowTrace
        title="intf_enabled_xfmr — GET direction (Redis → OC)"
        scenario='gNMI GET: read admin_status="up" from Redis, return enabled=true'
        accent="#3b82f6"
        steps={[
          {
            line: "var intf_enabled_xfmr FieldXfmrFunc = func(inParams XfmrParams) (map[string]string, error) {",
            explain: 'Translib read admin_status from Redis (HGET PORT|Ethernet0 admin_status → "up") and now calls the transformer. inParams.oper = GET, inParams.param = "up" (string from Redis).',
            variable: "inParams.oper / inParams.param",
            value: 'GET / "up" (string from Redis)',
            color: "#3b82f6",
          },
          {
            line: "    result := make(map[string]string)",
            explain: "Empty result map. In GET direction, result keys will be OpenConfig field names (not Redis field names).",
            variable: "result",
            value: "{}  ← empty map",
            color: "#8b5cf6",
          },
          {
            line: "    if inParams.oper == GET {",
            explain: "inParams.oper IS GET, so we enter this branch.",
            variable: "inParams.oper == GET",
            value: "true → ENTER GET block",
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '        adminStatus, ok := inParams.param.(string)',
            explain: 'Type-assert inParams.param to string. Redis stores all values as strings, so this is always the right type for GET. adminStatus = "up".',
            variable: "adminStatus / ok",
            value: '"up" / true',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '        if adminStatus == "up" {',
            explain: '"up" == "up" is true, so we take this branch and map to OC boolean true.',
            variable: 'adminStatus == "up"',
            value: "true → take if branch",
            color: "#3b82f6",
          },
          {
            line: '            result["enabled"] = "true"',
            explain: 'Put "enabled"→"true" into result. Note: in GET direction the result key is the OPENCONFIG field name ("enabled"), NOT the Redis field name.',
            variable: "result",
            value: '{"enabled": "true"}',
            color: "#10b981",
            highlight: true,
          },
          {
            line: "    return result, nil",
            explain: 'Returns {"enabled": "true"} to Translib. Translib serializes this into the gNMI GET response: { "enabled": true }. The string "true" becomes JSON boolean true.',
            variable: "gNMI response",
            value: '{ "enabled": true }  ← returned to client',
            color: "#10b981",
            highlight: true,
          },
        ]}
      />
    </section>
  );
}
