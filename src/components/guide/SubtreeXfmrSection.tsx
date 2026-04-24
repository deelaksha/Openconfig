"use client";
import React from "react";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";
import StepByStep from "@/components/cards/StepByStep";
import DataFlowTrace from "@/components/guide/DataFlowTrace";

export default function SubtreeXfmrSection() {
  return (
    <section data-section="subtree-transformer" id="subtree-transformer" className="scroll-mt-20">
      <h2>6. Type 5 — Subtree Transformer</h2>
      <p>
        A Subtree Transformer <strong>takes complete ownership</strong> of a YANG branch.
        It bypasses all other annotation (no table-name, field-name, key-transformer, field-transformer).
        The Go function receives the entire subtree and manually reads/writes to any Redis tables it needs.
      </p>

      <div className="rounded-2xl border p-4 my-4" style={{ borderColor: "#ef444430", background: "#ef444405" }}>
        <div className="text-xs font-bold mb-2" style={{ color: "#ef4444" }}>✅ Use Subtree Transformer ONLY when:</div>
        <ul className="text-xs space-y-1" style={{ color: "var(--text-secondary)" }}>
          <li>• One OC subtree must write to <strong>2+ Redis tables</strong> (e.g. ACL_TABLE + ACL_RULE)</li>
          <li>• The mapping logic is too complex for individual field/key transformers</li>
          <li>• You need to READ from other Redis tables to decide what to write</li>
          <li>• Do NOT use this just because it&apos;s powerful — it&apos;s the hardest to maintain</li>
        </ul>
      </div>

      {/* Why subtree is needed visual */}
      <div className="rounded-xl sm:rounded-2xl border p-3 sm:p-5 my-4 sm:my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
        <div className="text-xs font-bold mb-3" style={{ color: "var(--text-primary)" }}>🤔 Why ACL needs a subtree transformer</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs">
          <div>
            <div className="font-bold mb-2" style={{ color: "#3b82f6" }}>OpenConfig: 1 tree</div>
            <div className="font-mono text-[10px] p-3 rounded-lg space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
              <div>/acl/acl-sets/acl-set[name=MY_ACL]</div>
              <div className="ml-2">├── config/name</div>
              <div className="ml-2">├── config/type</div>
              <div className="ml-2">└── acl-entries/acl-entry[seq=10]</div>
              <div className="ml-6">├── config/sequence-id</div>
              <div className="ml-6">├── ipv4/config/source-address</div>
              <div className="ml-6">└── actions/config/forwarding-action</div>
            </div>
          </div>
          <div>
            <div className="font-bold mb-2" style={{ color: "#f59e0b" }}>SONiC Redis: 2 tables</div>
            <div className="font-mono text-[10px] p-3 rounded-lg space-y-2" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
              <div>
                <div style={{ color: "#3b82f6" }}>ACL_TABLE|MY_ACL</div>
                <div className="ml-2">type: &quot;L3&quot;</div>
                <div className="ml-2">policy_desc: &quot;My ACL&quot;</div>
              </div>
              <div>
                <div style={{ color: "#f59e0b" }}>ACL_RULE|MY_ACL|RULE_10</div>
                <div className="ml-2">SRC_IP: &quot;10.0.0.0/8&quot;</div>
                <div className="ml-2">PACKET_ACTION: &quot;FORWARD&quot;</div>
              </div>
            </div>
            <div className="text-[10px] mt-2" style={{ color: "#ef4444" }}>
              ← Simple field-name cannot split one OC tree into 2 Redis tables!
            </div>
          </div>
        </div>
      </div>

      <h3>Step 1 — The Annotation</h3>
      <AnnotatedCodeBlock
        title="openconfig-acl-annot.yang"
        language="yang"
        lines={[
          { code: "deviation /oc-acl:acl/oc-acl:acl-sets {", annotation: "Target: the acl-sets CONTAINER (not a list!)", highlight: true, color: "#ef4444" },
          { code: "  deviate add {" },
          { code: "    oc-ext:subtree-transformer \"acl_sets_xfmr\";", annotation: "One function handles EVERYTHING below this node", highlight: true, color: "#ef4444" },
          { code: "    // NO table-name    ← subtree xfmr decides tables", annotation: "All static annotations are skipped" },
          { code: "    // NO field-name   ← subtree xfmr maps all fields", },
          { code: "    // NO key-transformer ← subtree xfmr builds all keys", },
          { code: "  }" },
          { code: "}" },
        ]}
      />

      <h3>Step 2 — The Go Transformer (line by line)</h3>
      <AnnotatedCodeBlock
        title="transformer/acl_sets_xfmr.go"
        language="go"
        lines={[
          { code: "package transformer" },
          { code: "" },
          { code: "func init() {" },
          { code: "    XlateFuncBind(\"acl_sets_xfmr\", acl_sets_xfmr)", annotation: "Same registration pattern as all transformers", highlight: true, color: "#f59e0b" },
          { code: "}" },
          { code: "" },
          { code: "// SubtreeXfmrFunc — most complex return type", annotation: "Returns map[tableName][redisKey] → db.Value" },
          { code: "var acl_sets_xfmr SubtreeXfmrFunc = func(", annotation: "SubtreeXfmrFunc type — completely different from others", highlight: true, color: "#ef4444" },
          { code: "    inParams XfmrParams,", },
          { code: ") (map[string]map[string]db.Value, error) {", annotation: "map[table][key] → {Field: map[fieldName]value}", highlight: true, color: "#10b981" },
          { code: "    result := make(map[string]map[string]db.Value)" },
          { code: "" },
          { code: "    if inParams.oper == SET {", annotation: "Handle write direction", highlight: true, color: "#f59e0b" },
          { code: "        // Extract ACL name from path" },
          { code: "        pathInfo := NewPathInfo(inParams.uri)", },
          { code: "        aclName := pathInfo.Var(\"name\")", annotation: "Get 'MY_ACL' from path", highlight: true, color: "#3b82f6" },
          { code: "" },
          { code: "        // Parse the full OpenConfig input tree", annotation: "inParams.param contains the entire subtree data" },
          { code: "        aclObj := inParams.param.(*ocbinds.OpenconfigAcl_Acl_AclSets)", annotation: "Unmarshal into generated Go struct" },
          { code: "" },
          { code: "        // ── Write TABLE 1: ACL_TABLE ──────────────────────", annotation: "Populate first Redis table" },
          { code: "        result[\"ACL_TABLE\"] = make(map[string]db.Value)", highlight: true, color: "#3b82f6" },
          { code: "        result[\"ACL_TABLE\"][aclName] = db.Value{", annotation: "Key = MY_ACL (no | separator here)" },
          { code: "            Field: map[string]string{" },
          { code: "                \"type\":        aclTypeToSonic(aclObj.Type),", annotation: "OC enum → SONiC string conversion" },
          { code: "                \"policy_desc\": aclObj.Description,", annotation: "Direct field copy" },
          { code: "            }," },
          { code: "        }" },
          { code: "" },
          { code: "        // ── Write TABLE 2: ACL_RULE ──────────────────────", annotation: "Populate second Redis table" },
          { code: "        result[\"ACL_RULE\"] = make(map[string]db.Value)", highlight: true, color: "#f59e0b" },
          { code: "        for seqId, entry := range aclObj.AclEntries.AclEntry {", annotation: "Iterate over all ACL entries in the tree" },
          { code: "            ruleKey := fmt.Sprintf(\"%s|RULE_%d\", aclName, seqId)", annotation: "Compound key: MY_ACL|RULE_10", highlight: true, color: "#f59e0b" },
          { code: "            result[\"ACL_RULE\"][ruleKey] = db.Value{" },
          { code: "                Field: map[string]string{" },
          { code: "                    \"SRC_IP\":        entry.Ipv4.Config.SourceAddress,", annotation: "Map each OC path → SONiC field" },
          { code: "                    \"PACKET_ACTION\": actionToSonic(entry.Actions.Config.ForwardingAction),", },
          { code: "                    \"PRIORITY\":      fmt.Sprintf(\"%d\", seqId)," },
          { code: "                }," },
          { code: "            }" },
          { code: "        }" },
          { code: "" },
          { code: "    } else if inParams.oper == GET {", annotation: "Handle read direction — reverse of above", highlight: true, color: "#3b82f6" },
          { code: "        // Read from BOTH tables and build the OC response tree" },
          { code: "        // Use inParams.dbs[db.ConfigDB] to read from Redis" },
          { code: "        // Then populate the ygRoot OC tree with the values" },
          { code: "        // (reverse of the SET logic above)" },
          { code: "    }" },
          { code: "" },
          { code: "    return result, nil", annotation: "Translib writes ALL tables in one atomic Redis transaction", highlight: true, color: "#10b981" },
          { code: "}" },
        ]}
      />

      <h3>End-to-End Subtree Flow</h3>
      <StepByStep
        steps={[
          {
            title: "gNMI SET: Create ACL with rules",
            description: "Client sends entire ACL subtree: name=MY_ACL, type=L3, 1 rule (seq=10, src=10.0.0.0/8, action=ACCEPT)",
            before: "/acl/acl-sets/acl-set[name=MY_ACL]",
            after: "{ type: L3, rules: [{seq:10, src:10.0.0.0/8, action:ACCEPT}] }",
            color: "#3b82f6",
          },
          {
            title: "Annotation engine finds subtree-transformer",
            description: "Sees oc-ext:subtree-transformer 'acl_sets_xfmr' — immediately calls function, skips all child-node annotation lookup",
            before: "subtree-transformer = \"acl_sets_xfmr\"",
            after: "acl_sets_xfmr(inParams) called",
            color: "#8b5cf6",
          },
          {
            title: "Go function parses OC tree",
            description: "Function receives entire OpenConfig ACL subtree in inParams.param, extracts aclName, type, all entries",
            color: "#06b6d4",
          },
          {
            title: "Writes ACL_TABLE entry",
            description: "Populates result[\"ACL_TABLE\"][\"MY_ACL\"] with type and description",
            before: "aclName = \"MY_ACL\", type = L3",
            after: "ACL_TABLE|MY_ACL → type: \"L3\", policy_desc: \"My ACL\"",
            color: "#f59e0b",
          },
          {
            title: "Writes ACL_RULE entry",
            description: "Iterates rules, builds compound key MY_ACL|RULE_10, maps src IP and action",
            before: "seq=10, src=10.0.0.0/8, action=ACCEPT",
            after: "ACL_RULE|MY_ACL|RULE_10 → SRC_IP, PACKET_ACTION, PRIORITY",
            color: "#ec4899",
          },
          {
            title: "Translib writes both tables atomically",
            description: "Both ACL_TABLE and ACL_RULE are written in a single Redis pipeline transaction",
            after: "✓ ACL_TABLE + ACL_RULE written atomically to CONFIG_DB",
            color: "#10b981",
          },
        ]}
      />

      {/* Return type diagram */}
      <div className="rounded-xl sm:rounded-2xl border p-3 sm:p-5 my-4 sm:my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
        <div className="text-xs font-bold mb-3" style={{ color: "var(--text-primary)" }}>📦 Subtree Return Type Visualized</div>
        <div className="font-mono text-[11px] space-y-1" style={{ color: "var(--text-secondary)" }}>
          <div>map[string] <span style={{ color: "#8b5cf6" }}>// map key = Redis TABLE name</span></div>
          <div className="ml-4">map[string] <span style={{ color: "#06b6d4" }}>// map key = Redis hash KEY</span></div>
          <div className="ml-8">db.Value<span style={{ color: "#10b981" }}>{"{"}</span></div>
          <div className="ml-10">Field: map[string]string <span style={{ color: "#f59e0b" }}>// field → value pairs</span></div>
          <div className="ml-8" style={{ color: "#10b981" }}>{"}"}</div>
          <div className="mt-3 p-3 rounded-lg" style={{ background: "var(--bg-code)" }}>
            <div><span style={{ color: "#8b5cf6" }}>&quot;ACL_TABLE&quot;</span>: {"{"}</div>
            <div className="ml-4"><span style={{ color: "#06b6d4" }}>&quot;MY_ACL&quot;</span>: db.Value{"{"} Field: {"{"} <span style={{ color: "#f59e0b" }}>&quot;type&quot;: &quot;L3&quot;</span> {"}"} {"}"}</div>
            <div>{"}"}</div>
            <div><span style={{ color: "#8b5cf6" }}>&quot;ACL_RULE&quot;</span>: {"{"}</div>
            <div className="ml-4"><span style={{ color: "#06b6d4" }}>&quot;MY_ACL|RULE_10&quot;</span>: db.Value{"{"} Field: {"{"} <span style={{ color: "#f59e0b" }}>&quot;SRC_IP&quot;: &quot;10.0.0.0/8&quot;</span> {"}"} {"}"}</div>
            <div>{"}"}</div>
          </div>
        </div>
      </div>

      <h3>🔬 Data Flow Trace — acl_sets_xfmr SET direction (hover any line)</h3>
      <p>
        Client sends: <code>SET /acl/acl-sets/acl-set[name=MY_ACL]</code> with type=L3 and one rule (seq=10, src=10.0.0.0/8, action=ACCEPT).
        Watch how the result map is built step by step.
      </p>
      <DataFlowTrace
        title="acl_sets_xfmr — SET direction (builds 2 Redis tables)"
        scenario="gNMI SET: Create ACL MY_ACL with 1 rule"
        accent="#ef4444"
        steps={[
          {
            line: "var acl_sets_xfmr SubtreeXfmrFunc = func(inParams XfmrParams) (map[string]map[string]db.Value, error) {",
            explain: "Translib calls this. inParams.oper=SET, inParams.param = the full OpenConfig ACL tree (aclObj). inParams.uri = the path including [name=MY_ACL].",
            variable: "inParams.oper / inParams.uri",
            value: 'SET / "/acl/acl-sets/acl-set[name=MY_ACL]"',
            color: "#ef4444",
          },
          {
            line: "    result := make(map[string]map[string]db.Value)",
            explain: "Create the outer map. This is the return value. Structure: result[tableName][redisKey] = db.Value{Field: map}. Currently completely empty.",
            variable: "result",
            value: "{}  ← outer map, empty",
            color: "#8b5cf6",
          },
          {
            line: "    if inParams.oper == SET {",
            explain: "oper IS SET, so we enter this block. The entire write path is inside here.",
            variable: "branch taken",
            value: "SET block",
            color: "#f59e0b",
            highlight: true,
          },
          {
            line: '        pathInfo := NewPathInfo(inParams.uri)',
            explain: "Parse the URI to extract list key variables. The ACL name is embedded in [name=MY_ACL] in the path.",
            variable: "pathInfo",
            value: 'parsed: { "name": "MY_ACL" }',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '        aclName := pathInfo.Var("name")',
            explain: 'Extract the ACL name from [name=MY_ACL] in the path. aclName = "MY_ACL".',
            variable: "aclName",
            value: '"MY_ACL"',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: "        aclObj := inParams.param.(*ocbinds.OpenconfigAcl_Acl_AclSets)",
            explain: "Type-assert inParams.param to the generated Go struct for AclSets. This gives us structured access to all OC fields: aclObj.Type, aclObj.Description, aclObj.AclEntries.",
            variable: "aclObj",
            value: "{ Type: L3, Description: 'My ACL', AclEntries: [{seq:10, src:10.0.0.0/8}] }",
            color: "#06b6d4",
            highlight: true,
          },
          {
            line: '        result["ACL_TABLE"] = make(map[string]db.Value)',
            explain: 'Initialize the inner map for ACL_TABLE. Now result has one key: "ACL_TABLE" pointing to an empty map.',
            variable: "result",
            value: '{"ACL_TABLE": {}}',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '        result["ACL_TABLE"][aclName] = db.Value{',
            explain: 'Create a db.Value entry keyed by aclName ("MY_ACL"). This will become the Redis hash key. The full Redis key will be: ACL_TABLE|MY_ACL.',
            variable: "result[\"ACL_TABLE\"]",
            value: '{"MY_ACL": {Field: ...}}',
            color: "#3b82f6",
          },
          {
            line: '            "type":        aclTypeToSonic(aclObj.Type),',
            explain: 'aclTypeToSonic() converts OC enum (L3) to SONiC string ("L3" or "IP"). Sets result["ACL_TABLE"]["MY_ACL"].Field["type"] = "L3".',
            variable: 'result["ACL_TABLE"]["MY_ACL"].Field["type"]',
            value: '"L3"',
            color: "#f59e0b",
            highlight: true,
          },
          {
            line: '            "policy_desc": aclObj.Description,',
            explain: 'Direct copy: OC description string → Redis field "policy_desc". No conversion needed.',
            variable: 'result["ACL_TABLE"]["MY_ACL"].Field["policy_desc"]',
            value: '"My ACL"',
            color: "#f59e0b",
          },
          {
            line: '        result["ACL_RULE"] = make(map[string]db.Value)',
            explain: 'Initialize the inner map for ACL_RULE. Now result has TWO keys: "ACL_TABLE" and "ACL_RULE".',
            variable: "result",
            value: '{"ACL_TABLE": {MY_ACL:...}, "ACL_RULE": {}}',
            color: "#ec4899",
            highlight: true,
          },
          {
            line: "        for seqId, entry := range aclObj.AclEntries.AclEntry {",
            explain: "Iterate over each ACL rule entry. In our scenario there is 1 entry: seqId=10, with src=10.0.0.0/8 and action=ACCEPT.",
            variable: "seqId / entry (iteration 1)",
            value: "10 / { src: 10.0.0.0/8, action: ACCEPT }",
            color: "#ec4899",
          },
          {
            line: '            ruleKey := fmt.Sprintf("%s|RULE_%d", aclName, seqId)',
            explain: 'Build compound Redis key: "MY_ACL" + "|RULE_" + "10" = "MY_ACL|RULE_10". This is the hash key within the ACL_RULE table.',
            variable: "ruleKey",
            value: '"MY_ACL|RULE_10"',
            color: "#ec4899",
            highlight: true,
          },
          {
            line: '                "SRC_IP":        entry.Ipv4.Config.SourceAddress,',
            explain: 'Map OC source-address field → Redis "SRC_IP" field. Value comes from the OC struct.',
            variable: 'result["ACL_RULE"]["MY_ACL|RULE_10"].Field["SRC_IP"]',
            value: '"10.0.0.0/8"',
            color: "#f59e0b",
            highlight: true,
          },
          {
            line: '                "PACKET_ACTION": actionToSonic(entry.Actions.Config.ForwardingAction),',
            explain: 'Convert OC enum (ACCEPT) to SONiC string. actionToSonic(ACCEPT) = "FORWARD".',
            variable: 'result["ACL_RULE"]["MY_ACL|RULE_10"].Field["PACKET_ACTION"]',
            value: '"FORWARD"',
            color: "#f59e0b",
          },
          {
            line: "    return result, nil",
            explain: 'Returns the complete result map with 2 table entries. Translib writes both in one atomic Redis transaction: HSET ACL_TABLE|MY_ACL type "L3" ... and HSET ACL_RULE|MY_ACL|RULE_10 SRC_IP "10.0.0.0/8" ...',
            variable: "Redis writes (atomic)",
            value: "ACL_TABLE|MY_ACL + ACL_RULE|MY_ACL|RULE_10",
            color: "#10b981",
            highlight: true,
          },
        ]}
      />

      <h3>🔬 Data Flow Trace — acl_sets_xfmr GET direction (hover any line)</h3>
      <p>
        Client sends: <code>GET /acl/acl-sets/acl-set[name=MY_ACL]</code>.
        The subtree transformer reads from BOTH Redis tables and builds the OpenConfig response tree.
      </p>
      <DataFlowTrace
        title="acl_sets_xfmr — GET direction (reads 2 Redis tables → builds OC tree)"
        scenario="gNMI GET: Read ACL MY_ACL with all rules"
        accent="#3b82f6"
        steps={[
          {
            line: "var acl_sets_xfmr SubtreeXfmrFunc = func(inParams XfmrParams) (map[string]map[string]db.Value, error) {",
            explain: "Translib calls this. inParams.oper=GET, inParams.uri contains [name=MY_ACL]. For GET, the function must read from Redis and populate the ygRoot OC tree.",
            variable: "inParams.oper / inParams.uri",
            value: 'GET / "/acl/acl-sets/acl-set[name=MY_ACL]"',
            color: "#3b82f6",
          },
          {
            line: "    } else if inParams.oper == GET {",
            explain: "oper IS GET, so we enter this branch. The goal is to read from Redis tables and build the OpenConfig response tree.",
            variable: "branch taken",
            value: "GET block",
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '        aclName := pathInfo.Var("name")',
            explain: 'Extract ACL name from path. aclName = "MY_ACL".',
            variable: "aclName",
            value: '"MY_ACL"',
            color: "#3b82f6",
            highlight: true,
          },
          {
            line: '        aclEntry, _ := inParams.dbs[db.ConfigDB].GetEntry(&db.TableSpec{Name: "ACL_TABLE"}, db.Key{Comp: []string{aclName}})',
            explain: 'Read ACL_TABLE|MY_ACL from CONFIG_DB. Returns the hash entry with type and policy_desc fields.',
            variable: "aclEntry",
            value: '{ type: "L3", policy_desc: "My ACL" }',
            color: "#8b5cf6",
            highlight: true,
          },
          {
            line: '        ruleKeys, _ := inParams.dbs[db.ConfigDB].GetKeys(&db.TableSpec{Name: "ACL_RULE"})',
            explain: 'Get all keys from ACL_RULE table. Filter for keys starting with MY_ACL| to find rules belonging to this ACL.',
            variable: "ruleKeys (filtered)",
            value: '["MY_ACL|RULE_10"]',
            color: "#f59e0b",
            highlight: true,
          },
          {
            line: '        ruleEntry, _ := inParams.dbs[db.ConfigDB].GetEntry(&db.TableSpec{Name: "ACL_RULE"}, ruleKey)',
            explain: 'Read each matching rule entry. For MY_ACL|RULE_10, get the SRC_IP, PACKET_ACTION, PRIORITY fields.',
            variable: "ruleEntry",
            value: '{ SRC_IP: "10.0.0.0/8", PACKET_ACTION: "FORWARD", PRIORITY: "10" }',
            color: "#f59e0b",
            highlight: true,
          },
          {
            line: "        // Populate ygRoot with the OC struct",
            explain: "Build the OpenConfig tree: set aclSet.Config.Name, aclSet.Config.Type (convert L3→enum), create AclEntry with sequence-id=10, source-address, forwarding-action.",
            variable: "ygRoot (OC tree)",
            value: "{ name: MY_ACL, type: ACL_IPV4, entries: [{seq:10, src:10.0.0.0/8, action:ACCEPT}] }",
            color: "#10b981",
            highlight: true,
          },
          {
            line: "    return result, nil",
            explain: "For GET, result map can be empty — the OC tree was populated directly via ygRoot. Translib serializes ygRoot into the gNMI GET response JSON.",
            variable: "gNMI response",
            value: '{ "acl-set": { "name": "MY_ACL", "type": "ACL_IPV4", "acl-entries": [...] } }',
            color: "#10b981",
            highlight: true,
          },
        ]}
      />
    </section>
  );
}
