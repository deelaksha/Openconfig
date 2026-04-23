"use client";
import React from "react";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import MappingVisual from "@/components/cards/MappingVisual";
import DataFlowTrace from "@/components/guide/DataFlowTrace";

export default function TableXfmrSection() {
  return (
    <section data-section="table-transformer" id="table-transformer" className="scroll-mt-20">
      <h2>5. Type 4 — Table Transformer</h2>
      <p>
        A Table Transformer <strong>replaces</strong> <code>table-name</code>. Instead of a
        static table, a Go function inspects the path at runtime and returns which Redis
        table(s) to use. Essential when one YANG list maps to different Redis tables.
      </p>

      <div className="rounded-2xl border p-4 my-4" style={{ borderColor: "#8b5cf630", background: "#8b5cf605" }}>
        <div className="text-xs font-bold mb-2" style={{ color: "#8b5cf6" }}>✅ Use Table Transformer when:</div>
        <ul className="text-xs space-y-1" style={{ color: "var(--text-secondary)" }}>
          <li>• The same YANG list path maps to different Redis tables depending on the value</li>
          <li>• Example: <code>/interfaces/interface</code> → PORT, VLAN, PORTCHANNEL, LOOPBACK depending on name</li>
          <li>• You need to write to <strong>multiple tables</strong> simultaneously from one list node</li>
          <li>• The table is computed from runtime context (feature flags, other DB values)</li>
        </ul>
      </div>

      <MappingVisual
        title="Table Transformer: Dynamic table routing by interface name"
        leftTitle="Interface Name"
        rightTitle="Redis Table"
        leftColor="#8b5cf6"
        rightColor="#10b981"
        rows={[
          { left: "Ethernet0", right: "PORT" },
          { left: "Vlan100", right: "VLAN" },
          { left: "PortChannel1", right: "PORTCHANNEL" },
          { left: "Loopback0", right: "LOOPBACK_INTERFACE" },
          { left: "Mgmt0", right: "MGMT_PORT" },
        ]}
      />

      <h3>Step 1 — The Annotation</h3>
      <AnnotatedCodeBlock
        title="openconfig-interfaces-annot.yang — table-transformer"
        language="yang"
        lines={[
          { code: "deviation /oc-if:interfaces/oc-if:interface {", annotation: "Target the LIST node", highlight: true, color: "#8b5cf6" },
          { code: "  deviate add {" },
          { code: "    // DO NOT use table-name here — table-transformer replaces it", annotation: "These two are mutually exclusive!", highlight: true, color: "#ef4444" },
          { code: "    oc-ext:table-transformer \"intf_table_xfmr\";", annotation: "Go function decides the table at runtime", highlight: true, color: "#8b5cf6" },
          { code: "    oc-ext:key-transformer \"intf_tbl_key_xfmr\";", annotation: "Still need key transformer alongside table transformer" },
          { code: "  }" },
          { code: "}" },
        ]}
      />

      <h3>Step 2 — The Go Transformer (line by line)</h3>
      <AnnotatedCodeBlock
        title="transformer/intf_table_xfmr.go"
        language="go"
        lines={[
          { code: "package transformer" },
          { code: "" },
          { code: "import \"strings\"" },
          { code: "" },
          { code: "func init() {" },
          { code: "    XlateFuncBind(\"intf_table_xfmr\", intf_table_xfmr)", annotation: "Register — name must match annotation", highlight: true, color: "#f59e0b" },
          { code: "}" },
          { code: "" },
          { code: "// TableXfmrFunc returns a SLICE of table names (not just one!)", annotation: "Can return multiple tables → write to all of them" },
          { code: "var intf_table_xfmr TableXfmrFunc = func(", annotation: "TableXfmrFunc — different type from Key/Field", highlight: true, color: "#8b5cf6" },
          { code: "    inParams XfmrParams,", },
          { code: ") ([]string, error) {", annotation: "Returns []string — can be multiple table names", highlight: true, color: "#10b981" },
          { code: "" },
          { code: "    // Extract the interface name from the gNMI path", },
          { code: "    pathInfo := NewPathInfo(inParams.uri)", annotation: "Parse URI to get key variables" },
          { code: "    intfName := pathInfo.Var(\"name\")", annotation: "Get value of [name=Ethernet0]", highlight: true, color: "#3b82f6" },
          { code: "" },
          { code: "    if intfName == \"\" {" },
          { code: "        return nil, errors.New(\"interface name is empty\")" },
          { code: "    }" },
          { code: "" },
          { code: "    // Decide table based on interface name prefix", annotation: "Each prefix maps to a different Redis table" },
          { code: "    switch {" },
          { code: "    case strings.HasPrefix(intfName, \"Ethernet\"):", annotation: "Ethernet → physical port table", highlight: true, color: "#3b82f6" },
          { code: "        return []string{\"PORT\"}, nil", annotation: "→ PORT table", highlight: true, color: "#3b82f6" },
          { code: "" },
          { code: "    case strings.HasPrefix(intfName, \"Vlan\"):", annotation: "Vlan → VLAN table", highlight: true, color: "#8b5cf6" },
          { code: "        return []string{\"VLAN\"}, nil", highlight: true, color: "#8b5cf6" },
          { code: "" },
          { code: "    case strings.HasPrefix(intfName, \"PortChannel\"):", highlight: true, color: "#06b6d4" },
          { code: "        return []string{\"PORTCHANNEL\"}, nil", highlight: true, color: "#06b6d4" },
          { code: "" },
          { code: "    case strings.HasPrefix(intfName, \"Loopback\"):", highlight: true, color: "#f59e0b" },
          { code: "        return []string{\"LOOPBACK_INTERFACE\"}, nil", highlight: true, color: "#f59e0b" },
          { code: "" },
          { code: "    case strings.HasPrefix(intfName, \"Mgmt\"):", highlight: true, color: "#10b981" },
          { code: "        return []string{\"MGMT_PORT\"}, nil", highlight: true, color: "#10b981" },
          { code: "" },
          { code: "    default:", },
          { code: "        return nil, fmt.Errorf(\"unknown interface type: %s\", intfName)", annotation: "Always handle unknown cases!" },
          { code: "    }" },
          { code: "}" },
        ]}
      />

      <h3>Advanced: Writing to Multiple Tables Simultaneously</h3>
      <p>Return multiple table names to write the same data to both tables at once:</p>
      <AnnotatedCodeBlock
        title="transformer/multi_table_xfmr.go"
        language="go"
        lines={[
          { code: "var multi_table_xfmr TableXfmrFunc = func(inParams XfmrParams) ([]string, error) {" },
          { code: "    // Return TWO tables — Translib writes to BOTH", annotation: "Useful when data is mirrored to two tables" },
          { code: "    return []string{\"PORT\", \"PORT_TABLE\"}, nil", annotation: "Both PORT and PORT_TABLE get updated", highlight: true, color: "#10b981" },
          { code: "}" },
        ]}
      />

      <div className="rounded-2xl border p-4 my-6" style={{ borderColor: "#ef444430", background: "#ef444405" }}>
        <div className="text-xs font-bold mb-2" style={{ color: "#ef4444" }}>⚠️ table-name vs table-transformer — never mix them</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg p-3" style={{ background: "#10b98108", border: "1px solid #10b98120" }}>
            <div className="font-bold mb-1" style={{ color: "#10b981" }}>✓ Correct: one or the other</div>
            <div className="font-mono text-[10px] space-y-0.5" style={{ color: "var(--text-secondary)" }}>
              <div>deviate add {"{"}</div>
              <div>&nbsp;&nbsp;oc-ext:table-transformer &quot;fn&quot;;</div>
              <div>&nbsp;&nbsp;oc-ext:key-transformer &quot;fn2&quot;;</div>
              <div>{"}"}</div>
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "#ef444408", border: "1px solid #ef444420" }}>
            <div className="font-bold mb-1" style={{ color: "#ef4444" }}>✗ Wrong: both at once</div>
            <div className="font-mono text-[10px] space-y-0.5" style={{ color: "var(--text-secondary)" }}>
              <div>deviate add {"{"}</div>
              <div>&nbsp;&nbsp;oc-ext:table-name &quot;PORT&quot;;</div>
              <div>&nbsp;&nbsp;oc-ext:table-transformer &quot;fn&quot;; ← conflict!</div>
              <div>{"}"}</div>
            </div>
          </div>
        </div>
      </div>

      <h3>🔬 Data Flow Trace — intf_table_xfmr for Ethernet0 (hover any line)</h3>
      <p>When Translib sees <code>table-transformer</code> on the list node, it calls this function to decide which Redis table to target <em>before</em> any field transformers run.</p>
      <DataFlowTrace
        title="intf_table_xfmr — Data Flow"
        scenario="SET /interfaces/interface[name=Ethernet0]/config/mtu = 9100"
        accent="#8b5cf6"
        steps={[
          {
            line: "var intf_table_xfmr TableXfmrFunc = func(inParams XfmrParams) ([]string, error) {",
            explain: "Translib calls this FIRST — even before the key transformer. It needs to know which table to target. inParams.uri contains the full gNMI path.",
            variable: "inParams.uri",
            value: '"/interfaces/interface[name=Ethernet0]/config/mtu"',
            color: "#8b5cf6",
          },
          {
            line: "    pathInfo := NewPathInfo(inParams.uri)",
            explain: "Parse the gNMI URI into a structured object. All [key=value] pairs in the path become accessible via .Var().",
            variable: "pathInfo",
            value: 'parsed: { "name": "Ethernet0" }',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '    intfName := pathInfo.Var("name")',
            explain: 'Extract the interface name from the path. pathInfo.Var("name") finds [name=Ethernet0] and returns "Ethernet0".',
            variable: "intfName",
            value: '"Ethernet0"',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '    if intfName == "" {',
            explain: "Guard: intfName is 'Ethernet0' so this check is false. Block is SKIPPED.",
            variable: 'intfName == ""',
            value: "false → skip",
            color: "#ef4444",
          },
          {
            line: "    switch {",
            explain: "Go switch evaluates cases top-to-bottom. Each case calls strings.HasPrefix on intfName.",
            variable: "evaluating switch",
            value: '"Ethernet0" vs each prefix',
            color: "#8b5cf6",
          },
          {
            line: '    case strings.HasPrefix(intfName, "Ethernet"):',
            explain: 'strings.HasPrefix("Ethernet0", "Ethernet") = true. This case matches immediately. No other cases will be evaluated.',
            variable: 'HasPrefix("Ethernet0", "Ethernet")',
            value: "true → MATCH",
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '        return []string{"PORT"}, nil',
            explain: 'Returns a slice containing just "PORT". Translib now knows to use the PORT table for all operations on this request. nil = no error.',
            variable: "return value",
            value: '["PORT"]  → Translib targets PORT table',
            color: "#10b981",
            highlight: true,
          },
        ]}
      />

      <h3>🔬 Data Flow Trace — intf_table_xfmr for Vlan100 (hover any line)</h3>
      <p>Same function, different input — notice how a different switch case fires:</p>
      <DataFlowTrace
        title="intf_table_xfmr — Data Flow for Vlan100"
        scenario="SET /interfaces/interface[name=Vlan100]/config/mtu = 1500"
        accent="#8b5cf6"
        steps={[
          {
            line: "var intf_table_xfmr TableXfmrFunc = func(inParams XfmrParams) ([]string, error) {",
            explain: "Same function is called. Now inParams.uri contains Vlan100 as the interface name.",
            variable: "inParams.uri",
            value: '"/interfaces/interface[name=Vlan100]/config/mtu"',
            color: "#8b5cf6",
          },
          {
            line: "    intfName := pathInfo.Var(\"name\")",
            explain: "This time pathInfo.Var returns 'Vlan100'.",
            variable: "intfName",
            value: '"Vlan100"',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '    case strings.HasPrefix(intfName, "Ethernet"):',
            explain: 'strings.HasPrefix("Vlan100", "Ethernet") = false. This case does NOT match. Evaluation continues to next case.',
            variable: 'HasPrefix("Vlan100", "Ethernet")',
            value: "false → skip",
            color: "#ef4444",
          },
          {
            line: '    case strings.HasPrefix(intfName, "Vlan"):',
            explain: 'strings.HasPrefix("Vlan100", "Vlan") = true. This case matches.',
            variable: 'HasPrefix("Vlan100", "Vlan")',
            value: "true → MATCH",
            color: "#8b5cf6",
            highlight: true,
          },
          {
            line: '        return []string{"VLAN"}, nil',
            explain: 'Returns ["VLAN"]. Translib now targets the VLAN Redis table instead of PORT. This is the power of table-transformer — same YANG path, different table based on runtime value.',
            variable: "return value",
            value: '["VLAN"]  → Translib targets VLAN table',
            color: "#10b981",
            highlight: true,
          },
        ]}
      />
    </section>
  );
}
