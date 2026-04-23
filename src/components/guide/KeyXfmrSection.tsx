"use client";
import React from "react";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import MappingVisual from "@/components/cards/MappingVisual";
import StepByStep from "@/components/cards/StepByStep";
import DataFlowTrace from "@/components/guide/DataFlowTrace";

export default function KeyXfmrSection() {
  return (
    <section data-section="key-transformer" id="key-transformer" className="scroll-mt-20">
      <h2>3. Type 2 — Key Transformer</h2>
      <p>
        A Key Transformer converts the <strong>YANG list key</strong> (e.g. <code>interface[name=Ethernet0]</code>)
        into the <strong>Redis hash key</strong> (e.g. <code>Ethernet0</code>). It runs once per request,
        before any field transformers.
      </p>

      <div className="rounded-2xl border p-4 my-4" style={{ borderColor: "#06b6d430", background: "#06b6d405" }}>
        <div className="text-xs font-bold mb-2" style={{ color: "#06b6d4" }}>✅ Use Key Transformer when:</div>
        <ul className="text-xs space-y-1" style={{ color: "var(--text-secondary)" }}>
          <li>• The YANG list key needs any transformation (extracting, reformatting, prefixing)</li>
          <li>• Example: <code>vlan[vlan-id=100]</code> → <code>Vlan100</code> (needs &quot;Vlan&quot; prefix added)</li>
          <li>• Example: <code>interface[name=Eth1/1]</code> → <code>Ethernet1/1</code> (name normalisation)</li>
          <li>• Even simple cases like <code>interface[name=Ethernet0]</code> → <code>Ethernet0</code> still use this</li>
        </ul>
      </div>

      <MappingVisual
        title="Key Transformer: What it converts"
        leftTitle="YANG list key (gNMI path)"
        rightTitle="Redis key"
        leftColor="#3b82f6"
        rightColor="#10b981"
        rows={[
          { left: "interface[name=Ethernet0]", right: "Ethernet0" },
          { left: "interface[name=Loopback0]", right: "Loopback0" },
          { left: "vlan[vlan-id=100]", right: "Vlan100" },
          { left: "bgp-peer[peer-address=10.0.0.1]", right: "10.0.0.1" },
        ]}
      />

      <h3>Step 1 — The Annotation</h3>
      <AnnotatedCodeBlock
        title="openconfig-interfaces-annot.yang"
        language="yang"
        lines={[
          { code: "deviation /oc-if:interfaces/oc-if:interface {", annotation: "Target = the LIST node (not a leaf!)", highlight: true, color: "#06b6d4" },
          { code: "  deviate add {" },
          { code: "    oc-ext:table-name \"PORT\";", annotation: "Fixed table name (or use table-transformer)" },
          { code: "    oc-ext:key-transformer \"intf_tbl_key_xfmr\";", annotation: "← The name must EXACTLY match XlateFuncBind()", highlight: true, color: "#06b6d4" },
          { code: "  }" },
          { code: "}" },
        ]}
      />

      <h3>Step 2 — The Go Transformer (line by line)</h3>
      <AnnotatedCodeBlock
        title="transformer/intf_tbl_key_xfmr.go"
        language="go"
        lines={[
          { code: "package transformer", annotation: "Must be in the 'transformer' package" },
          { code: "" },
          { code: "import (", },
          { code: "    \"errors\"", annotation: "For error creation" },
          { code: "    \"github.com/Azure/sonic-mgmt-common/translib/utils\"", annotation: "For NewPathInfo" },
          { code: ")", },
          { code: "" },
          { code: "func init() {", annotation: "init() runs ONCE at program startup — before any request" },
          { code: "    XlateFuncBind(\"intf_tbl_key_xfmr\", intf_tbl_key_xfmr)", annotation: "Register fn by name → must match annotation string!", highlight: true, color: "#f59e0b" },
          { code: "}", },
          { code: "" },
          { code: "// KeyXfmrFunc signature: receives XfmrParams, returns (string, error)", annotation: "This type is defined by Translib — don't change signature" },
          { code: "var intf_tbl_key_xfmr KeyXfmrFunc = func(", annotation: "var + KeyXfmrFunc type = required pattern", highlight: true, color: "#06b6d4" },
          { code: "    inParams XfmrParams,", annotation: "XfmrParams carries: uri, oper, dbs, key, param..." },
          { code: ") (string, error) {", annotation: "Returns ONE Redis key string (e.g. 'Ethernet0')", highlight: true, color: "#10b981" },
          { code: "" },
          { code: "    // Parse the gNMI URI to extract list key variables", annotation: "NewPathInfo parses /interfaces/interface[name=Ethernet0]/..." },
          { code: "    pathInfo := NewPathInfo(inParams.uri)", annotation: "pathInfo holds all [key=value] pairs from the path", highlight: true, color: "#3b82f6" },
          { code: "" },
          { code: "    // Extract the list key by its YANG key name", annotation: "Var(\"name\") matches the key= in interface[name=Ethernet0]" },
          { code: "    intfName := pathInfo.Var(\"name\")", annotation: "→ intfName = \"Ethernet0\"", highlight: true, color: "#3b82f6" },
          { code: "" },
          { code: "    // Guard: always validate the key is present", annotation: "Empty key = request is malformed" },
          { code: "    if intfName == \"\" {", highlight: true, color: "#ef4444" },
          { code: "        return \"\", errors.New(\"interface name is empty\")", annotation: "Return error → Translib will reject the request" },
          { code: "    }" },
          { code: "" },
          { code: "    // Return the Redis key string", annotation: "Translib will use this as: PORT|<returned string>" },
          { code: "    return intfName, nil", annotation: "→ returns \"Ethernet0\" → Redis key = PORT|Ethernet0", highlight: true, color: "#10b981" },
          { code: "}" },
        ]}
      />

      <h3>Step 3 — VLAN Example: Key with Prefix Addition</h3>
      <p>Sometimes the Redis key needs to be <strong>constructed</strong>, not just extracted:</p>
      <AnnotatedCodeBlock
        title="transformer/vlan_key_xfmr.go"
        language="go"
        lines={[
          { code: "func init() {" },
          { code: "    XlateFuncBind(\"vlan_key_xfmr\", vlan_key_xfmr)", highlight: true, color: "#f59e0b" },
          { code: "}" },
          { code: "" },
          { code: "var vlan_key_xfmr KeyXfmrFunc = func(inParams XfmrParams) (string, error) {" },
          { code: "    pathInfo := NewPathInfo(inParams.uri)" },
          { code: "    vlanId := pathInfo.Var(\"vlan-id\")", annotation: "Key name comes from YANG: list vlan { key \"vlan-id\"; }", highlight: true, color: "#3b82f6" },
          { code: "" },
          { code: "    if vlanId == \"\" {" },
          { code: "        return \"\", errors.New(\"vlan-id is empty\")" },
          { code: "    }" },
          { code: "" },
          { code: "    // Redis stores VLANs as 'Vlan100' not '100'", annotation: "Must add 'Vlan' prefix to match SONiC convention" },
          { code: "    return \"Vlan\" + vlanId, nil", annotation: "vlan-id=100 → \"Vlan100\" → Redis key: VLAN|Vlan100", highlight: true, color: "#10b981" },
          { code: "}" },
        ]}
      />

      <MappingVisual
        title="VLAN Key Transformer Result"
        leftTitle="YANG key in path"
        rightTitle="Redis key"
        leftColor="#8b5cf6"
        rightColor="#10b981"
        rows={[
          { left: "vlan[vlan-id=100]", right: "VLAN|Vlan100" },
          { left: "vlan[vlan-id=200]", right: "VLAN|Vlan200" },
          { left: "vlan[vlan-id=4094]", right: "VLAN|Vlan4094" },
        ]}
      />

      <h3>🔬 Data Flow Trace — intf_tbl_key_xfmr (hover any line)</h3>
      <p>Trace the exact value of every variable through the function for the call: <code>GET /interfaces/interface[name=Ethernet0]/config/mtu</code></p>
      <DataFlowTrace
        title="intf_tbl_key_xfmr — Data Flow"
        scenario="Any request for /interfaces/interface[name=Ethernet0]/..."
        accent="#06b6d4"
        steps={[
          {
            line: "// Translib calls this function for every request on this list",
            explain: "Translib looked up 'intf_tbl_key_xfmr' in the global xfmrTbl map (registered at startup) and is now calling it.",
            isComment: true,
          },
          {
            line: "var intf_tbl_key_xfmr KeyXfmrFunc = func(inParams XfmrParams) (string, error) {",
            explain: "Function starts. inParams is a struct already populated by Translib with the full gNMI URI and operation type.",
            variable: "inParams.uri",
            value: '"/interfaces/interface[name=Ethernet0]/config/mtu"',
            color: "#06b6d4",
          },
          {
            line: "    pathInfo := NewPathInfo(inParams.uri)",
            explain: "NewPathInfo() parses the URI and builds an object that lets you extract [key=value] variables from it. inParams.uri is the full gNMI path.",
            variable: "pathInfo",
            value: 'parsed: { "name": "Ethernet0" }',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '    intfName := pathInfo.Var("name")',
            explain: 'pathInfo.Var("name") looks for the YANG list key named "name" inside interface[name=Ethernet0]. It finds and returns "Ethernet0".',
            variable: "intfName",
            value: '"Ethernet0"',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '    if intfName == "" {',
            explain: 'Guard check: if the client sent a wildcard path (no specific interface), name would be empty. This request has a name so this block is SKIPPED.',
            variable: "intfName == \"\"",
            value: "false → skip block",
            color: "#ef4444",
          },
          {
            line: '        return "", errors.New("interface name is empty")',
            explain: "This line is NOT reached in our scenario. It would only run if intfName was empty, causing Translib to reject the request with an error.",
            isComment: false,
            color: "var(--text-tertiary)" as never,
          },
          {
            line: "    return intfName, nil",
            explain: 'Returns "Ethernet0" to Translib as the Redis key string. nil means no error. Translib then builds the full Redis key: table + "|" + returned_key = PORT|Ethernet0.',
            variable: "return value",
            value: '"Ethernet0" → Translib builds: PORT|Ethernet0',
            color: "#10b981",
            highlight: true,
          },
        ]}
      />

      <h3>🔬 Data Flow Trace — vlan_key_xfmr (hover any line)</h3>
      <p>For the VLAN case the key must be <strong>constructed</strong> — not just extracted:</p>
      <DataFlowTrace
        title="vlan_key_xfmr — Data Flow"
        scenario="SET /vlans/vlan[vlan-id=100]/config/name"
        accent="#8b5cf6"
        steps={[
          {
            line: "var vlan_key_xfmr KeyXfmrFunc = func(inParams XfmrParams) (string, error) {",
            explain: "Function entry. inParams.uri already contains the full VLAN path including [vlan-id=100].",
            variable: "inParams.uri",
            value: '"/vlans/vlan[vlan-id=100]/config/name"',
            color: "#8b5cf6",
          },
          {
            line: "    pathInfo := NewPathInfo(inParams.uri)",
            explain: "Parse the URI to extract all YANG key=value pairs embedded in the path.",
            variable: "pathInfo",
            value: 'parsed: { "vlan-id": "100" }',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '    vlanId := pathInfo.Var("vlan-id")',
            explain: 'YANG list key name is "vlan-id" (from: list vlan { key "vlan-id"; }). pathInfo.Var returns "100" as a string.',
            variable: "vlanId",
            value: '"100"',
            color: "#8b5cf6",
            highlight: true,
          },
          {
            line: '    if vlanId == "" {',
            explain: "Guard: vlanId is '100' so this block is SKIPPED.",
            variable: "vlanId == \"\"",
            value: "false → skip",
            color: "#ef4444",
          },
          {
            line: '    return "Vlan" + vlanId, nil',
            explain: 'String concatenation: "Vlan" + "100" = "Vlan100". Translib builds the final Redis key: VLAN|Vlan100. Without this prefix, SONiC would not find the entry.',
            variable: "return value",
            value: '"Vlan100" → Translib builds: VLAN|Vlan100',
            color: "#10b981",
            highlight: true,
          },
        ]}
      />
    </section>
  );
}

