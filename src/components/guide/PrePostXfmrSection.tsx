"use client";
import React from "react";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";

export default function PrePostXfmrSection() {
  return (
    <section data-section="pre-post-transformer" id="pre-post-transformer" className="scroll-mt-20">
      <h2>7. Type 6 — Pre &amp; Post Transformers</h2>
      <p>
        Pre and Post transformers are <strong>hooks</strong> that run around the normal field transformer pipeline.
        They are used for cross-field validation, dependency checks, and side effects — not for primary value mapping.
      </p>

      <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
        <div className="text-xs font-bold mb-4" style={{ color: "var(--text-primary)" }}>⚡ Execution Order on Every Request</div>
        <div className="space-y-2">
          {[
            { order: "1st", name: "Table Transformer", when: "Decides which Redis table(s)", type: "oc-ext:table-transformer", c: "#8b5cf6" },
            { order: "2nd", name: "Key Transformer", when: "Builds the Redis key string", type: "oc-ext:key-transformer", c: "#06b6d4" },
            { order: "3rd", name: "Pre Transformer", when: "Runs BEFORE field transformers — validation, auth", type: "sonic-ext:pre-transformer", c: "#f97316" },
            { order: "4th", name: "Field Transformer(s)", when: "Converts each leaf value (one per leaf)", type: "oc-ext:field-transformer", c: "#f59e0b" },
            { order: "5th", name: "Post Transformer", when: "Runs AFTER field transformers — cross-field logic", type: "sonic-ext:post-transformer", c: "#ec4899" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ background: item.c }}>{item.order}</div>
              <div className="flex-1 rounded-xl px-3 py-2" style={{ background: `${item.c}06`, border: `1px solid ${item.c}15` }}>
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-xs font-semibold" style={{ color: item.c }}>{item.name}</span>
                  <code className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${item.c}15`, color: item.c }}>{item.type}</code>
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

      <div className="rounded-2xl border p-4 my-6" style={{ borderColor: "#ec489930", background: "#ec489905" }}>
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
    </section>
  );
}
