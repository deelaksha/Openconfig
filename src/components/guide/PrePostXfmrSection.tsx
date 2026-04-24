"use client";
import React from "react";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import DataFlowTrace from "@/components/guide/DataFlowTrace";

export default function PrePostXfmrSection() {
  return (
    <section data-section="pre-post-transformer" id="pre-post-transformer" className="scroll-mt-20">
      <h2>7. Type 6 — Pre &amp; Post Transformers</h2>
      <p>
        Pre and Post transformers are <strong>hooks</strong> that run around the normal field transformer pipeline.
        They are used for cross-field validation, dependency checks, and side effects — not for primary value mapping.
      </p>

      <div className="rounded-xl sm:rounded-2xl border p-3 sm:p-5 my-4 sm:my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
        <div className="text-xs font-bold mb-3 sm:mb-4" style={{ color: "var(--text-primary)" }}>⚡ Execution Order on Every Request</div>
        <div className="space-y-2">
          {[
            { order: "1st", name: "Table Transformer", when: "Decides which Redis table(s)", type: "oc-ext:table-transformer", c: "#8b5cf6" },
            { order: "2nd", name: "Key Transformer", when: "Builds the Redis key string", type: "oc-ext:key-transformer", c: "#06b6d4" },
            { order: "3rd", name: "Pre Transformer", when: "Runs BEFORE field transformers — validation, auth", type: "sonic-ext:pre-transformer", c: "#f97316" },
            { order: "4th", name: "Field Transformer(s)", when: "Converts each leaf value (one per leaf)", type: "oc-ext:field-transformer", c: "#f59e0b" },
            { order: "5th", name: "Post Transformer", when: "Runs AFTER field transformers — cross-field logic", type: "sonic-ext:post-transformer", c: "#ec4899" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold shrink-0"
                style={{ background: item.c }}>{item.order}</div>
              <div className="flex-1 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2" style={{ background: `${item.c}06`, border: `1px solid ${item.c}15` }}>
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-[11px] sm:text-xs font-semibold" style={{ color: item.c }}>{item.name}</span>
                  <code className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded" style={{ background: `${item.c}15`, color: item.c }}>{item.type}</code>
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.when}</div>
              </div>
            </div>
          ))}
          <div className="text-[10px] mt-3 p-2 rounded-lg text-center" style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
            ⚠️ If subtree-transformer is present — ALL of the above are skipped. Subtree handles everything alone.
          </div>
        </div>
      </div>

      <h3>Pre Transformer — Annotation &amp; Go Code</h3>
      <p>Use <code>pre-transformer</code> for <strong>validation before writing</strong> to Redis:</p>
      <AnnotatedCodeBlock
        title="openconfig-interfaces-annot.yang — pre-transformer"
        language="yang"
        lines={[
          { code: "deviation /oc-if:interfaces/oc-if:interface {", annotation: "Applied at the list/container level" },
          { code: "  deviate add {" },
          { code: "    oc-ext:table-name \"PORT\";", },
          { code: "    oc-ext:key-transformer \"intf_tbl_key_xfmr\";" },
          { code: "    sonic-ext:pre-transformer \"intf_pre_xfmr\";", annotation: "Runs BEFORE field transformers. Note: sonic-ext not oc-ext!", highlight: true, color: "#f97316" },
          { code: "  }" },
          { code: "}" },
        ]}
      />
      <AnnotatedCodeBlock
        title="transformer/intf_pre_xfmr.go"
        language="go"
        lines={[
          { code: "func init() { XlateFuncBind(\"intf_pre_xfmr\", intf_pre_xfmr) }" },
          { code: "" },
          { code: "// PreXfmrFunc — runs before field transformers, can abort the operation", annotation: "If it returns error, the entire SET/GET is rejected" },
          { code: "var intf_pre_xfmr PreXfmrFunc = func(inParams XfmrParams) error {", highlight: true, color: "#f97316" },
          { code: "" },
          { code: "    pathInfo := NewPathInfo(inParams.uri)" },
          { code: "    intfName := pathInfo.Var(\"name\")" },
          { code: "" },
          { code: "    // Example: reject management interface writes", annotation: "Only allow non-Mgmt interfaces to be configured" },
          { code: "    if strings.HasPrefix(intfName, \"Mgmt\") {", highlight: true, color: "#ef4444" },
          { code: "        return errors.New(\"cannot configure management interface via OC\")", annotation: "Return error → Translib sends 403 to gNMI client" },
          { code: "    }" },
          { code: "" },
          { code: "    // Example: check dependency in Redis before writing", annotation: "Read current state before allowing write" },
          { code: "    portEntry, _ := inParams.dbs[db.ConfigDB].GetEntry(\"PORT\", intfName)", annotation: "Read existing Redis entry" },
          { code: "    if portEntry.IsPopulated() == false {", highlight: true, color: "#ef4444" },
          { code: "        return fmt.Errorf(\"interface %s does not exist\", intfName)" },
          { code: "    }" },
          { code: "" },
          { code: "    return nil", annotation: "nil = OK, proceed with field transformers", highlight: true, color: "#10b981" },
          { code: "}" },
        ]}
      />

      <h3>Post Transformer — Annotation &amp; Go Code</h3>
      <p>Use <code>post-transformer</code> for <strong>cross-field side effects after writing</strong>:</p>
      <AnnotatedCodeBlock
        title="openconfig-interfaces-annot.yang — post-transformer"
        language="yang"
        lines={[
          { code: "deviation /oc-if:interfaces/oc-if:interface {" },
          { code: "  deviate add {" },
          { code: "    oc-ext:table-name \"PORT\";" },
          { code: "    sonic-ext:post-transformer \"intf_post_xfmr\";", annotation: "Runs AFTER all field transformers complete", highlight: true, color: "#ec4899" },
          { code: "  }" },
          { code: "}" },
        ]}
      />
      <AnnotatedCodeBlock
        title="transformer/intf_post_xfmr.go"
        language="go"
        lines={[
          { code: "func init() { XlateFuncBind(\"intf_post_xfmr\", intf_post_xfmr) }" },
          { code: "" },
          { code: "// PostXfmrFunc — receives the result map built by field transformers", annotation: "Can modify the result before Translib writes to Redis" },
          { code: "var intf_post_xfmr PostXfmrFunc = func(", highlight: true, color: "#ec4899" },
          { code: "    inParams XfmrParams," },
          { code: "    result map[string]map[string]db.Value,", annotation: "The accumulated result from ALL field transformers" },
          { code: ") error {" },
          { code: "" },
          { code: "    pathInfo := NewPathInfo(inParams.uri)" },
          { code: "    intfName := pathInfo.Var(\"name\")" },
          { code: "" },
          { code: "    // Example: when admin_status changes, also update oper_status", annotation: "Cross-field: one OC write triggers another Redis field" },
          { code: "    portTable := result[\"PORT\"]" },
          { code: "    if entry, ok := portTable[intfName]; ok {", highlight: true, color: "#ec4899" },
          { code: "        if adminStatus, ok := entry.Field[\"admin_status\"]; ok {" },
          { code: "            // Mirror admin_status to oper_status for loopbacks", annotation: "Loopback oper = admin (no physical link)" },
          { code: "            if strings.HasPrefix(intfName, \"Loopback\") {" },
          { code: "                entry.Field[\"oper_status\"] = adminStatus", annotation: "Add extra field to the result map", highlight: true, color: "#10b981" },
          { code: "                result[\"PORT\"][intfName] = entry" },
          { code: "            }" },
          { code: "        }" },
          { code: "    }" },
          { code: "" },
          { code: "    return nil", annotation: "nil = OK, Translib will write the (now modified) result", highlight: true, color: "#10b981" },
          { code: "}" },
        ]}
      />

      <div className="rounded-xl sm:rounded-2xl border p-3 sm:p-4 my-4 sm:my-6" style={{ borderColor: "#ec489930", background: "#ec489905" }}>
        <div className="text-xs font-bold mb-2" style={{ color: "#ec4899" }}>📌 Pre vs Post — When to use which</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1.5" style={{ color: "var(--text-secondary)" }}>
            <div className="font-semibold" style={{ color: "#f97316" }}>Pre Transformer</div>
            <div>• Validate input before any processing</div>
            <div>• Check permissions / authorization</div>
            <div>• Check dependencies exist in Redis</div>
            <div>• Can return error to ABORT the operation</div>
          </div>
          <div className="space-y-1.5" style={{ color: "var(--text-secondary)" }}>
            <div className="font-semibold" style={{ color: "#ec4899" }}>Post Transformer</div>
            <div>• Add fields computed from multiple OC leafs</div>
            <div>• Trigger side effects in other Redis tables</div>
            <div>• Modify the result map before Redis write</div>
            <div>• Cannot abort — validation should be in pre</div>
          </div>
        </div>
      </div>

      <h3>🔬 Data Flow Trace — intf_pre_xfmr (hover any line)</h3>
      <p>Scenario A (allowed): <code>SET /interfaces/interface[name=Ethernet0]/config/mtu = 9100</code></p>
      <DataFlowTrace
        title="intf_pre_xfmr — validates before field transformers run"
        scenario="SET for Ethernet0 — interface exists in Redis"
        accent="#f97316"
        steps={[
          {
            line: "var intf_pre_xfmr PreXfmrFunc = func(inParams XfmrParams) error {",
            explain: "Translib calls this BEFORE any field transformer. inParams.oper=SET, inParams.uri contains [name=Ethernet0]. The function returns nil (allow) or an error (reject).",
            variable: "inParams.oper / inParams.uri",
            value: 'SET / "/interfaces/interface[name=Ethernet0]/config/mtu"',
            color: "#f97316",
          },
          {
            line: '    pathInfo := NewPathInfo(inParams.uri)',
            explain: "Parse the gNMI URI to extract [name=Ethernet0].",
            variable: "pathInfo",
            value: 'parsed: { "name": "Ethernet0" }',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '    intfName := pathInfo.Var("name")',
            explain: "Extract the interface name. intfName = 'Ethernet0'.",
            variable: "intfName",
            value: '"Ethernet0"',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '    if strings.HasPrefix(intfName, "Mgmt") {',
            explain: 'strings.HasPrefix("Ethernet0", "Mgmt") = false. Guard passes, block SKIPPED. For Mgmt0 this would be true and we would return error.',
            variable: 'HasPrefix("Ethernet0", "Mgmt")',
            value: "false → skip rejection block",
            color: "#ef4444",
          },
          {
            line: '    portEntry, _ := inParams.dbs[db.ConfigDB].GetEntry("PORT", intfName)',
            explain: 'Read the PORT|Ethernet0 entry from CONFIG_DB. If Ethernet0 exists in the PORT table, portEntry will be populated. This is a real Redis read!',
            variable: "portEntry",
            value: "{ admin_status: 'up', mtu: '9100', speed: '40000' }  ← populated",
            color: "#f97316",
            highlight: true,
          },
          {
            line: "    if portEntry.IsPopulated() == false {",
            explain: "portEntry IS populated (Ethernet0 exists), so IsPopulated() = true and this block is SKIPPED.",
            variable: "portEntry.IsPopulated()",
            value: "true → IsPopulated()==false is false → skip",
            color: "#ef4444",
          },
          {
            line: "    return nil",
            explain: "Return nil = no error = pre-validation PASSED. Translib now continues to run field transformers (intf_enabled_xfmr, etc.) and then the post transformer.",
            variable: "return value",
            value: "nil → proceed to field transformers",
            color: "#10b981",
            highlight: true,
          },
        ]}
      />

      <h3>🔬 Data Flow Trace — intf_pre_xfmr REJECTION (hover any line)</h3>
      <p>Scenario B (rejected): <code>SET /interfaces/interface[name=Mgmt0]/config/mtu = 1500</code></p>
      <DataFlowTrace
        title="intf_pre_xfmr — rejects management interface writes"
        scenario="SET for Mgmt0 — rejected by pre transformer"
        accent="#ef4444"
        steps={[
          {
            line: "var intf_pre_xfmr PreXfmrFunc = func(inParams XfmrParams) error {",
            explain: "Translib calls this before any field transformer. inParams.uri contains [name=Mgmt0].",
            variable: "inParams.uri",
            value: '"/interfaces/interface[name=Mgmt0]/config/mtu"',
            color: "#f97316",
          },
          {
            line: '    intfName := pathInfo.Var("name")',
            explain: "Extract the interface name from the path. intfName = 'Mgmt0'.",
            variable: "intfName",
            value: '"Mgmt0"',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '    if strings.HasPrefix(intfName, "Mgmt") {',
            explain: 'strings.HasPrefix("Mgmt0", "Mgmt") = TRUE. This is a management interface — we block it.',
            variable: 'HasPrefix("Mgmt0", "Mgmt")',
            value: "true → ENTER rejection block",
            color: "#ef4444",
            highlight: true,
          },
          {
            line: '        return errors.New("cannot configure management interface via OC")',
            explain: "Return a non-nil error. This ABORTS the entire operation. Translib will NOT call any field transformers, post transformer, or write to Redis. The gNMI client receives a 403 error.",
            variable: "return value",
            value: 'error: "cannot configure management interface via OC" → 403 to client',
            color: "#ef4444",
            highlight: true,
          },
        ]}
      />

      <h3>🔬 Data Flow Trace — intf_post_xfmr (hover any line)</h3>
      <p>
        Scenario: After <code>SET enabled=false</code> for <code>Loopback0</code>, the post transformer
        also sets <code>oper_status</code> to mirror the admin status (loopbacks have no physical link).
      </p>
      <DataFlowTrace
        title="intf_post_xfmr — adds oper_status after field transformers built the result map"
        scenario="SET enabled=false for Loopback0 (field xfmr already set admin_status=down)"
        accent="#ec4899"
        steps={[
          {
            line: "var intf_post_xfmr PostXfmrFunc = func(inParams XfmrParams, result map[string]map[string]db.Value) error {",
            explain: 'Translib calls this AFTER all field transformers ran. result already contains: {"PORT": {"Loopback0": {Field: {"admin_status": "down"}}}}. The post xfmr can ADD more fields to this map.',
            variable: "result (coming in)",
            value: '{"PORT": {"Loopback0": {"admin_status": "down"}}}',
            color: "#ec4899",
          },
          {
            line: '    intfName := pathInfo.Var("name")',
            explain: "Extract interface name from URI. intfName = 'Loopback0'.",
            variable: "intfName",
            value: '"Loopback0"',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '    portTable := result["PORT"]',
            explain: 'Get the PORT sub-map from the result. This is the map that the field transformer already populated.',
            variable: "portTable",
            value: '{"Loopback0": {Field: {"admin_status": "down"}}}',
            color: "#ec4899",
            highlight: true,
          },
          {
            line: '    if entry, ok := portTable[intfName]; ok {',
            explain: "Check if there's a PORT entry for Loopback0. ok=true because field transformer set it. entry = db.Value with admin_status=down.",
            variable: "entry / ok",
            value: "{ Field: {admin_status: 'down'} } / true",
            color: "#ec4899",
          },
          {
            line: '        if adminStatus, ok := entry.Field["admin_status"]; ok {',
            explain: 'Get admin_status from the field map. adminStatus = "down", ok = true.',
            variable: "adminStatus / ok",
            value: '"down" / true',
            color: "#f59e0b",
            highlight: true,
          },
          {
            line: '            if strings.HasPrefix(intfName, "Loopback") {',
            explain: 'strings.HasPrefix("Loopback0", "Loopback") = true. We enter this block and add oper_status.',
            variable: 'HasPrefix("Loopback0", "Loopback")',
            value: "true → enter block",
            color: "#8b5cf6",
            highlight: true,
          },
          {
            line: '                entry.Field["oper_status"] = adminStatus',
            explain: 'Add "oper_status" = "down" to the field map. This is a NEW field that was not set by any field transformer — the post xfmr is adding it as a side effect.',
            variable: 'entry.Field["oper_status"]',
            value: '"down"  ← new field added!',
            color: "#10b981",
            highlight: true,
          },
          {
            line: '                result["PORT"][intfName] = entry',
            explain: 'Write the modified entry back into the result map. Now result contains BOTH admin_status AND oper_status for Loopback0.',
            variable: "result (modified)",
            value: '{"PORT": {"Loopback0": {"admin_status":"down", "oper_status":"down"}}}',
            color: "#10b981",
            highlight: true,
          },
          {
            line: "    return nil",
            explain: 'Return nil = post transformer succeeded. Translib now writes the MODIFIED result to Redis: HSET PORT|Loopback0 admin_status "down" oper_status "down".',
            variable: "Redis write",
            value: 'HSET PORT|Loopback0 admin_status "down" oper_status "down"',
            color: "#10b981",
            highlight: true,
          },
        ]}
      />
    </section>
  );
}
