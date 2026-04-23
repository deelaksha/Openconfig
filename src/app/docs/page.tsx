"use client";

import React from "react";
import { motion } from "framer-motion";
import FlowDiagram from "@/components/cards/FlowDiagram";
import StepByStep from "@/components/cards/StepByStep";
import MappingVisual from "@/components/cards/MappingVisual";
import AnnotatedCodeBlock from "@/components/codeblock/AnnotatedCodeBlock";

export default function DocsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* HERO */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium mb-4"
          style={{ borderColor: "var(--border-primary)", background: "var(--bg-tertiary)", color: "var(--accent-blue)" }}
        >
          End-to-End Walkthrough
        </div>
        <h1 className="!mt-0">Interface <code>enabled</code> → <code>admin_status</code></h1>
        <p>
          One feature, fully traced: from the OpenConfig YANG model through the annotation
          file, extensions, and transformer code, all the way to the Redis DB — and back again.
        </p>
      </div>

      {/* BIG PICTURE FLOW */}
      <FlowDiagram
        title="The Complete Pipeline"
        steps={[
          { label: "OpenConfig", sublabel: "YANG Model", color: "#3b82f6", detail: "enabled = true" },
          { label: "Annotation", sublabel: ".yang file", color: "#8b5cf6", detail: "maps path → table" },
          { label: "Extension", sublabel: "oc-ext", color: "#06b6d4", detail: "table-name, field-name" },
          { label: "Transformer", sublabel: "Go function", color: "#f59e0b", detail: "true → \"up\"" },
          { label: "Redis DB", sublabel: "CONFIG_DB", color: "#10b981", detail: "PORT|Ethernet0" },
        ]}
      />

      {/* ======================================================== */}
      {/* SECTION 1: OPENCONFIG YANG MODEL                         */}
      {/* ======================================================== */}
      <section data-section="yang-model" id="yang-model" className="scroll-mt-20">
        <h2>1. The OpenConfig YANG Model</h2>
        <p>
          This is the <strong>source model</strong> — what a network engineer sees.
          It defines an <code>enabled</code> leaf of type <code>boolean</code> inside
          the interface config container.
        </p>

        {/* Visual tree */}
        <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            🌳 YANG Tree Structure
          </h4>
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

        <p>The YANG definition of this leaf:</p>

        <AnnotatedCodeBlock
          title="openconfig-interfaces.yang"
          language="yang"
          lines={[
            { code: "module openconfig-interfaces {", annotation: "Module name — imported by annotation" },
            { code: "  namespace \"http://openconfig.net/yang/interfaces\";", annotation: "Unique namespace URI" },
            { code: "  prefix oc-if;", annotation: "Short prefix used in paths", highlight: true, color: "#3b82f6" },
            { code: "" },
            { code: "  grouping interface-config {" },
            { code: "    leaf enabled {", annotation: "This is the leaf we're mapping", highlight: true, color: "#3b82f6" },
            { code: "      type boolean;", annotation: "OpenConfig type: true or false", highlight: true, color: "#10b981" },
            { code: "      default \"true\";", annotation: "Defaults to enabled" },
            { code: "      description" },
            { code: "        \"Desired state of the interface.\";" },
            { code: "    }" },
            { code: "  }" },
            { code: "}" },
          ]}
        />

        <p>
          The gNMI path to reach this leaf:<br/>
          <code>/openconfig-interfaces:interfaces/interface[name=Ethernet0]/config/enabled</code>
        </p>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: ANNOTATION FILE                                */}
      {/* ======================================================== */}
      <section data-section="annotation-file" id="annotation-file" className="scroll-mt-20">
        <h2>2. The Annotation File</h2>
        <p>
          The annotation file is a <strong>separate YANG file</strong> that adds mapping
          metadata to the OpenConfig paths using <code>deviation</code> blocks. It tells
          Translib: &quot;when you see this path, go to this Redis table and field.&quot;
        </p>

        <AnnotatedCodeBlock
          title="openconfig-interfaces-annot.yang"
          language="yang"
          lines={[
            { code: "module openconfig-interfaces-annot {", annotation: "Annotation module name" },
            { code: "" },
            { code: "  import openconfig-interfaces { prefix oc-if; }", annotation: "Import the model we're annotating", highlight: true, color: "#3b82f6" },
            { code: "  import openconfig-extensions { prefix oc-ext; }", annotation: "Import the mapping extensions", highlight: true, color: "#8b5cf6" },
            { code: "" },
            { code: "  // Map the interface list node", annotation: "Comment: what this block does" },
            { code: "  deviation /oc-if:interfaces/oc-if:interface {", annotation: "Target: the list node in the YANG tree", highlight: true, color: "#06b6d4" },
            { code: "    deviate add {", annotation: "'add' = attach new metadata" },
            { code: "      oc-ext:table-name \"PORT\";", annotation: "→ Redis table = PORT", highlight: true, color: "#10b981" },
            { code: "      oc-ext:key-transformer \"intf_tbl_key_xfmr\";", annotation: "→ Go function to convert the key", highlight: true, color: "#f59e0b" },
            { code: "    }" },
            { code: "  }" },
            { code: "" },
            { code: "  // Map the 'enabled' leaf", annotation: "Now map the specific leaf" },
            { code: "  deviation /oc-if:interfaces/oc-if:interface", annotation: "Full path to the leaf..." },
            { code: "            /oc-if:config/oc-if:enabled {", annotation: "...must include every node with prefix", highlight: true, color: "#06b6d4" },
            { code: "    deviate add {" },
            { code: "      oc-ext:field-name \"admin_status\";", annotation: "→ Redis field = admin_status", highlight: true, color: "#10b981" },
            { code: "      oc-ext:field-transformer \"intf_enabled_xfmr\";", annotation: "→ Go function: true ↔ \"up\"", highlight: true, color: "#f59e0b" },
            { code: "    }" },
            { code: "  }" },
            { code: "}" },
          ]}
        />

        {/* Visual: What each piece decides */}
        <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            📋 What each annotation decides
          </h4>
          <div className="space-y-2">
            {[
              { question: "Which Redis table?", answer: "PORT", source: "table-name", color: "#10b981" },
              { question: "Which Redis key?", answer: "intf_tbl_key_xfmr(Ethernet0) → Ethernet0", source: "key-transformer", color: "#f59e0b" },
              { question: "Which Redis field?", answer: "admin_status", source: "field-name", color: "#8b5cf6" },
              { question: "How to convert value?", answer: "intf_enabled_xfmr(true) → \"up\"", source: "field-transformer", color: "#ef4444" },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 rounded-lg px-3 py-2"
                style={{ background: `${item.color}06`, border: `1px solid ${item.color}15` }}
              >
                <div className="text-xs font-medium shrink-0 w-36" style={{ color: "var(--text-secondary)" }}>
                  {item.question}
                </div>
                <div className="text-xs font-mono font-semibold" style={{ color: item.color }}>
                  {item.answer}
                </div>
                <div className="ml-auto text-[9px] px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: `${item.color}12`, color: item.color }}
                >
                  {item.source}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: EXTENSIONS                                     */}
      {/* ======================================================== */}
      <section data-section="extensions" id="extensions" className="scroll-mt-20">
        <h2>3. Extensions (oc-ext)</h2>
        <p>
          Extensions are keywords defined in the <code>openconfig-extensions</code> module.
          They are the vocabulary the annotation uses to describe the mapping. Here&apos;s
          every extension used in our example:
        </p>

        <div className="space-y-3 my-6">
          {[
            {
              name: "table-name",
              syntax: "oc-ext:table-name \"PORT\";",
              what: "Tells Translib which Redis table to read/write",
              example: "PORT → means Redis key starts with PORT|...",
              color: "#10b981",
            },
            {
              name: "field-name",
              syntax: "oc-ext:field-name \"admin_status\";",
              what: "Tells Translib which Redis hash field to use",
              example: "admin_status → the field inside PORT|Ethernet0",
              color: "#8b5cf6",
            },
            {
              name: "key-transformer",
              syntax: "oc-ext:key-transformer \"intf_tbl_key_xfmr\";",
              what: "Name of a Go function that converts the YANG list key to a Redis key",
              example: "interface[name=Ethernet0] → Ethernet0",
              color: "#f59e0b",
            },
            {
              name: "field-transformer",
              syntax: "oc-ext:field-transformer \"intf_enabled_xfmr\";",
              what: "Name of a Go function that converts field values both ways",
              example: "true → \"up\" (SET) and \"up\" → true (GET)",
              color: "#ef4444",
            },
            {
              name: "table-transformer",
              syntax: "oc-ext:table-transformer \"intf_table_xfmr\";",
              what: "Dynamically decides the Redis table at runtime (instead of a fixed table-name)",
              example: "Ethernet0 → PORT, Vlan100 → VLAN, Loopback0 → LOOPBACK",
              color: "#06b6d4",
            },
            {
              name: "db-name",
              syntax: "oc-ext:db-name \"APPL_DB\";",
              what: "Specifies which Redis database to target (default: CONFIG_DB)",
              example: "CONFIG_DB (config), APPL_DB (oper state), STATE_DB (hw state)",
              color: "#3b82f6",
            },
          ].map((ext, i) => (
            <motion.div key={ext.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: `${ext.color}25` }}
            >
              <div className="px-4 py-2 flex items-center gap-2"
                style={{ background: `${ext.color}10` }}
              >
                <code className="text-xs font-bold" style={{ color: ext.color }}>{ext.name}</code>
              </div>
              <div className="px-4 py-3 space-y-1.5" style={{ background: "var(--bg-card)" }}>
                <div className="font-mono text-[11px] px-2 py-1 rounded" style={{ background: "var(--bg-code)", color: "var(--text-primary)" }}>
                  {ext.syntax}
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  <strong>What:</strong> {ext.what}
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  <strong>Example:</strong> {ext.example}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Which DB for what */}
        <MappingVisual
          title="Which Redis Database?"
          leftTitle="Data Type"
          rightTitle="Target DB"
          leftColor="#8b5cf6"
          rightColor="#10b981"
          rows={[
            { left: "Config (e.g. enabled)", right: "CONFIG_DB (db 4)", label: "default" },
            { left: "Oper state (e.g. oper-status)", right: "APPL_DB (db 0)" },
            { left: "HW state (e.g. temperature)", right: "STATE_DB (db 6)" },
          ]}
        />
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: TRANSFORMERS                                   */}
      {/* ======================================================== */}
      <section data-section="transformers" id="transformers" className="scroll-mt-20">
        <h2>4. Transformer Code</h2>
        <p>
          Transformers are Go functions registered by name. The annotation references them
          by name, and Translib calls them at runtime. Let&apos;s look at each one for our
          <code>enabled</code> example.
        </p>

        {/* ---- KEY TRANSFORMER ---- */}
        <div data-section="key-transformer" id="key-transformer" className="scroll-mt-20">
          <h3>4a. Key Transformer</h3>
          <p>
            Extracts the interface name from the gNMI path and returns it as the Redis key.
          </p>

          {/* Visual: What it does */}
          <MappingVisual
            title="Key Transformer: What it converts"
            leftTitle="gNMI Path Key"
            rightTitle="Redis Key"
            leftColor="#3b82f6"
            rightColor="#10b981"
            rows={[
              { left: "interface[name=Ethernet0]", right: "Ethernet0" },
              { left: "interface[name=Ethernet4]", right: "Ethernet4" },
              { left: "interface[name=Loopback0]", right: "Loopback0" },
            ]}
          />

          <AnnotatedCodeBlock
            title="intf_tbl_key_xfmr.go"
            language="go"
            lines={[
              { code: "func init() {", annotation: "Runs at startup" },
              { code: "    XlateFuncBind(\"intf_tbl_key_xfmr\", intf_tbl_key_xfmr)", annotation: "Register this function by name", highlight: true, color: "#f59e0b" },
              { code: "}" },
              { code: "" },
              { code: "var intf_tbl_key_xfmr KeyXfmrFunc = func(", annotation: "The function type is KeyXfmrFunc" },
              { code: "    inParams XfmrParams,", annotation: "Receives path, value, operation" },
              { code: ") (string, error) {", annotation: "Returns: Redis key string" },
              { code: "" },
              { code: "    pathInfo := NewPathInfo(inParams.uri)", annotation: "Parse the URI to extract variables" },
              { code: "    intfName := pathInfo.Var(\"name\")", annotation: "Get value of [name=Ethernet0]", highlight: true, color: "#3b82f6" },
              { code: "" },
              { code: "    if intfName == \"\" {", annotation: "Guard: name must not be empty" },
              { code: "        return \"\", errors.New(\"name is empty\")" },
              { code: "    }" },
              { code: "" },
              { code: "    return intfName, nil", annotation: "Return \"Ethernet0\" as Redis key", highlight: true, color: "#10b981" },
              { code: "}" },
            ]}
          />
        </div>

        {/* ---- FIELD TRANSFORMER ---- */}
        <div data-section="field-transformer" id="field-transformer" className="scroll-mt-20">
          <h3>4b. Field Transformer</h3>
          <p>
            Converts between OpenConfig&apos;s <code>boolean</code> and SONiC&apos;s <code>string</code>.
            This is <strong>bidirectional</strong> — it handles both SET and GET.
          </p>

          {/* Visual: Both directions */}
          <MappingVisual
            title="SET Direction (Write): OpenConfig → SONiC"
            leftTitle="OpenConfig Value"
            rightTitle="Redis Value"
            leftColor="#3b82f6"
            rightColor="#10b981"
            rows={[
              { left: "enabled = true", right: "admin_status = \"up\"", label: "SET" },
              { left: "enabled = false", right: "admin_status = \"down\"", label: "SET" },
            ]}
          />
          <MappingVisual
            title="GET Direction (Read): SONiC → OpenConfig"
            leftTitle="Redis Value"
            rightTitle="OpenConfig Value"
            leftColor="#10b981"
            rightColor="#3b82f6"
            rows={[
              { left: "admin_status = \"up\"", right: "enabled = true", label: "GET" },
              { left: "admin_status = \"down\"", right: "enabled = false", label: "GET" },
            ]}
          />

          <AnnotatedCodeBlock
            title="intf_enabled_xfmr.go"
            language="go"
            lines={[
              { code: "func init() {" },
              { code: "    XlateFuncBind(\"intf_enabled_xfmr\", intf_enabled_xfmr)", annotation: "Register by name (must match annotation!)", highlight: true, color: "#f59e0b" },
              { code: "}" },
              { code: "" },
              { code: "var intf_enabled_xfmr FieldXfmrFunc = func(", annotation: "FieldXfmrFunc = handles field values" },
              { code: "    inParams XfmrParams,", annotation: "Contains: oper, param (the value)" },
              { code: ") (map[string]string, error) {", annotation: "Returns: map of field→value pairs" },
              { code: "    result := make(map[string]string)" },
              { code: "" },
              { code: "    if inParams.oper == GET {", annotation: "GET = read from Redis, return OC value", highlight: true, color: "#3b82f6" },
              { code: "        adminStatus := inParams.param.(string)", annotation: "Read Redis value (\"up\" or \"down\")" },
              { code: "        if adminStatus == \"up\" {" },
              { code: "            result[\"enabled\"] = \"true\"", annotation: "\"up\" → boolean true", highlight: true, color: "#10b981" },
              { code: "        } else {" },
              { code: "            result[\"enabled\"] = \"false\"", annotation: "\"down\" → boolean false" },
              { code: "        }" },
              { code: "" },
              { code: "    } else {", annotation: "SET = write to Redis from OC value", highlight: true, color: "#f59e0b" },
              { code: "        enabled := inParams.param.(bool)", annotation: "Read OpenConfig value (true/false)" },
              { code: "        if enabled {" },
              { code: "            result[\"admin_status\"] = \"up\"", annotation: "true → \"up\"", highlight: true, color: "#10b981" },
              { code: "        } else {" },
              { code: "            result[\"admin_status\"] = \"down\"", annotation: "false → \"down\"" },
              { code: "        }" },
              { code: "    }" },
              { code: "" },
              { code: "    return result, nil", annotation: "Return the mapped result" },
              { code: "}" },
            ]}
          />
        </div>

        {/* ---- TABLE TRANSFORMER ---- */}
        <div data-section="table-transformer" id="table-transformer" className="scroll-mt-20">
          <h3>4c. Table Transformer (Optional)</h3>
          <p>
            Used <strong>instead of</strong> a fixed <code>table-name</code> when different
            values of the same path map to different Redis tables.
          </p>

          {/* Visual: dynamic routing */}
          <MappingVisual
            title="Table Transformer: Dynamic Table Routing"
            leftTitle="Interface Name"
            rightTitle="Redis Table"
            leftColor="#8b5cf6"
            rightColor="#10b981"
            rows={[
              { left: "Ethernet0", right: "PORT" },
              { left: "Vlan100", right: "VLAN" },
              { left: "PortChannel1", right: "PORTCHANNEL" },
              { left: "Loopback0", right: "LOOPBACK_INTERFACE" },
            ]}
          />

          <AnnotatedCodeBlock
            title="intf_table_xfmr.go"
            language="go"
            lines={[
              { code: "var intf_table_xfmr TableXfmrFunc = func(", annotation: "TableXfmrFunc = returns table name(s)" },
              { code: "    inParams XfmrParams,", },
              { code: ") ([]string, error) {", annotation: "Returns list of table names" },
              { code: "" },
              { code: "    pathInfo := NewPathInfo(inParams.uri)" },
              { code: "    intfName := pathInfo.Var(\"name\")" },
              { code: "" },
              { code: "    switch {", annotation: "Check the interface name prefix" },
              { code: "    case strings.HasPrefix(intfName, \"Ethernet\"):", highlight: true, color: "#3b82f6" },
              { code: "        return []string{\"PORT\"}, nil", annotation: "Ethernet → PORT table", highlight: true, color: "#3b82f6" },
              { code: "    case strings.HasPrefix(intfName, \"Vlan\"):", highlight: true, color: "#8b5cf6" },
              { code: "        return []string{\"VLAN\"}, nil", annotation: "Vlan → VLAN table", highlight: true, color: "#8b5cf6" },
              { code: "    case strings.HasPrefix(intfName, \"PortChannel\"):", highlight: true, color: "#06b6d4" },
              { code: "        return []string{\"PORTCHANNEL\"}, nil", annotation: "PortChannel → PORTCHANNEL", highlight: true, color: "#06b6d4" },
              { code: "    case strings.HasPrefix(intfName, \"Loopback\"):", highlight: true, color: "#10b981" },
              { code: "        return []string{\"LOOPBACK_INTERFACE\"}, nil", annotation: "Loopback → LOOPBACK_INTERFACE", highlight: true, color: "#10b981" },
              { code: "    default:" },
              { code: "        return nil, fmt.Errorf(\"unknown: %s\", intfName)", annotation: "Error for unknown types" },
              { code: "    }" },
              { code: "}" },
            ]}
          />
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 5: SET FLOW                                       */}
      {/* ======================================================== */}
      <section data-section="set-flow" id="set-flow" className="scroll-mt-20">
        <h2>5. SET Flow: OpenConfig → Redis</h2>
        <p>
          The complete write path when a client sends <code>enabled = true</code> for Ethernet0:
        </p>

        <StepByStep
          steps={[
            {
              title: "gNMI Client sends SET request",
              description: "An automation tool or engineer sends a gNMI SET with path and value.",
              before: "/interfaces/interface[name=Ethernet0]/config/enabled",
              after: "value = true",
              color: "#3b82f6",
            },
            {
              title: "Translib validates the YANG model",
              description: "Checks: Does /config/enabled exist? Is 'true' a valid boolean? → Yes!",
              color: "#8b5cf6",
            },
            {
              title: "Annotation engine looks up the mapping",
              description: "Reads the annotation file and finds: table=PORT, key-xfmr=intf_tbl_key_xfmr, field=admin_status, field-xfmr=intf_enabled_xfmr",
              before: "deviation /oc-if:.../enabled",
              after: "table: PORT, field: admin_status",
              color: "#06b6d4",
            },
            {
              title: "Key Transformer runs",
              description: "intf_tbl_key_xfmr extracts 'Ethernet0' from the path and returns it as the Redis key.",
              before: "interface[name=Ethernet0]",
              after: "Redis key: PORT|Ethernet0",
              color: "#f59e0b",
            },
            {
              title: "Field Transformer runs",
              description: "intf_enabled_xfmr sees oper=SET, converts boolean true to string \"up\".",
              before: "enabled = true (boolean)",
              after: "admin_status = \"up\" (string)",
              color: "#ec4899",
            },
            {
              title: "DB Client writes to CONFIG_DB",
              description: "Executes: HSET PORT|Ethernet0 admin_status \"up\" in Redis database 4.",
              before: "HSET PORT|Ethernet0 admin_status",
              after: "\"up\" ✓ Written!",
              color: "#10b981",
            },
          ]}
        />

        <FlowDiagram
          title="SET Flow Summary"
          steps={[
            { label: "enabled", sublabel: "= true", color: "#3b82f6" },
            { label: "Validate", sublabel: "YANG check", color: "#8b5cf6" },
            { label: "Annotate", sublabel: "find mapping", color: "#06b6d4" },
            { label: "Key Xfmr", sublabel: "→ Ethernet0", color: "#f59e0b" },
            { label: "Field Xfmr", sublabel: "true → \"up\"", color: "#ec4899" },
            { label: "Redis Write", sublabel: "HSET", color: "#10b981" },
          ]}
        />
      </section>

      {/* ======================================================== */}
      {/* SECTION 6: GET FLOW                                       */}
      {/* ======================================================== */}
      <section data-section="get-flow" id="get-flow" className="scroll-mt-20">
        <h2>6. GET Flow: Redis → OpenConfig</h2>
        <p>
          The read path is the <strong>exact reverse</strong>. Let&apos;s read the enabled status back:
        </p>

        <StepByStep
          steps={[
            {
              title: "gNMI Client sends GET request",
              description: "Client asks: 'What is the enabled status of Ethernet0?'",
              before: "GET /interfaces/interface[name=Ethernet0]/config/enabled",
              color: "#3b82f6",
            },
            {
              title: "Annotation engine resolves mapping",
              description: "Same annotation as SET: table=PORT, key-xfmr, field=admin_status, field-xfmr.",
              after: "table: PORT, field: admin_status",
              color: "#06b6d4",
            },
            {
              title: "Key Transformer resolves Redis key",
              description: "intf_tbl_key_xfmr returns 'Ethernet0', so we read from PORT|Ethernet0.",
              before: "interface[name=Ethernet0]",
              after: "Read from: PORT|Ethernet0",
              color: "#f59e0b",
            },
            {
              title: "Redis read: HGET",
              description: "DB Client executes: HGET PORT|Ethernet0 admin_status → returns \"up\"",
              before: "HGET PORT|Ethernet0 admin_status",
              after: "\"up\"",
              color: "#10b981",
            },
            {
              title: "Field Transformer reverses the value",
              description: "intf_enabled_xfmr sees oper=GET, converts string \"up\" back to boolean true.",
              before: "admin_status = \"up\"",
              after: "enabled = true",
              color: "#ec4899",
            },
            {
              title: "Response sent to client",
              description: "gNMI server sends back: enabled = true in the gNMI GET response.",
              after: "{ \"enabled\": true } ✓",
              color: "#3b82f6",
            },
          ]}
        />

        <FlowDiagram
          title="GET Flow Summary (reverse direction)"
          steps={[
            { label: "GET Request", sublabel: "client asks", color: "#3b82f6" },
            { label: "Annotate", sublabel: "find mapping", color: "#06b6d4" },
            { label: "Key Xfmr", sublabel: "→ Ethernet0", color: "#f59e0b" },
            { label: "Redis Read", sublabel: "HGET → \"up\"", color: "#10b981" },
            { label: "Field Xfmr", sublabel: "\"up\" → true", color: "#ec4899" },
            { label: "Response", sublabel: "enabled=true", color: "#3b82f6" },
          ]}
        />
      </section>

      {/* ======================================================== */}
      {/* SECTION 7: REDIS OUTPUT                                   */}
      {/* ======================================================== */}
      <section data-section="redis-output" id="redis-output" className="scroll-mt-20">
        <h2>7. Redis DB: Final State</h2>
        <p>
          After the SET flow completes, this is what exists in each Redis database.
          Our <code>enabled</code> example writes to <strong>CONFIG_DB</strong> only.
        </p>

        {/* Visual: Database entries */}
        <div className="space-y-4 my-6">
          {/* CONFIG_DB */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "#10b98130" }}
          >
            <div className="px-4 py-2.5 flex items-center justify-between"
              style={{ background: "#10b98112" }}
            >
              <div className="text-xs font-bold" style={{ color: "#10b981" }}>CONFIG_DB (Redis DB 4)</div>
              <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Persistent config — survives reboot</div>
            </div>
            <div className="p-4" style={{ background: "var(--bg-card)" }}>
              <div className="font-mono text-xs space-y-3">
                <div className="rounded-lg p-3" style={{ background: "var(--bg-code)" }}>
                  <div className="font-bold mb-1.5" style={{ color: "#10b981" }}>PORT|Ethernet0</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5" style={{ color: "var(--text-secondary)" }}>
                    <span><span style={{ color: "#3b82f6" }}>admin_status</span>: &quot;up&quot;</span>
                    <span className="text-[10px] italic" style={{ color: "var(--text-tertiary)" }}>← our mapped field!</span>
                    <span>mtu: &quot;9100&quot;</span>
                    <span className="text-[10px] italic" style={{ color: "var(--text-tertiary)" }}>direct field-name</span>
                    <span>speed: &quot;40000&quot;</span>
                    <span className="text-[10px] italic" style={{ color: "var(--text-tertiary)" }}>uses speed transformer</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* APPL_DB */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "#3b82f630" }}
          >
            <div className="px-4 py-2.5 flex items-center justify-between"
              style={{ background: "#3b82f612" }}
            >
              <div className="text-xs font-bold" style={{ color: "#3b82f6" }}>APPL_DB (Redis DB 0)</div>
              <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Volatile oper state — set by apps</div>
            </div>
            <div className="p-4" style={{ background: "var(--bg-card)" }}>
              <div className="font-mono text-xs space-y-3">
                <div className="rounded-lg p-3" style={{ background: "var(--bg-code)" }}>
                  <div className="font-bold mb-1.5" style={{ color: "#3b82f6" }}>PORT_TABLE:Ethernet0</div>
                  <div className="space-y-0.5" style={{ color: "var(--text-secondary)" }}>
                    <div>oper_status: &quot;up&quot; <span className="text-[10px] italic" style={{ color: "var(--text-tertiary)" }}>← read via db-name &quot;APPL_DB&quot;</span></div>
                    <div>speed: &quot;40000&quot;</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STATE_DB */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "#8b5cf630" }}
          >
            <div className="px-4 py-2.5 flex items-center justify-between"
              style={{ background: "#8b5cf612" }}
            >
              <div className="text-xs font-bold" style={{ color: "#8b5cf6" }}>STATE_DB (Redis DB 6)</div>
              <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Hardware/System state — read-only</div>
            </div>
            <div className="p-4" style={{ background: "var(--bg-card)" }}>
              <div className="font-mono text-xs space-y-3">
                <div className="rounded-lg p-3" style={{ background: "var(--bg-code)" }}>
                  <div className="font-bold mb-1.5" style={{ color: "#8b5cf6" }}>PORT_TABLE|Ethernet0</div>
                  <div className="space-y-0.5" style={{ color: "var(--text-secondary)" }}>
                    <div>netdev_oper_status: &quot;up&quot; <span className="text-[10px] italic" style={{ color: "var(--text-tertiary)" }}>← physical link state</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Final summary */}
        <div className="rounded-2xl border p-6 my-8" style={{ borderColor: "rgba(59, 130, 246, 0.3)", background: "rgba(59, 130, 246, 0.05)" }}>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "#3b82f6" }}>
            📌 Complete Mapping Summary
          </h4>
          <div className="text-xs space-y-2" style={{ color: "var(--text-secondary)" }}>
            <div className="flex gap-2">
              <span className="font-semibold w-32 shrink-0" style={{ color: "var(--text-primary)" }}>YANG Model:</span>
              <code>openconfig-interfaces → leaf enabled (boolean)</code>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32 shrink-0" style={{ color: "var(--text-primary)" }}>Annotation:</span>
              <code>table-name=&quot;PORT&quot;, field-name=&quot;admin_status&quot;</code>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32 shrink-0" style={{ color: "var(--text-primary)" }}>Key Xfmr:</span>
              <code>intf_tbl_key_xfmr → extracts &quot;Ethernet0&quot;</code>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32 shrink-0" style={{ color: "var(--text-primary)" }}>Field Xfmr:</span>
              <code>intf_enabled_xfmr → true↔&quot;up&quot;, false↔&quot;down&quot;</code>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32 shrink-0" style={{ color: "var(--text-primary)" }}>Redis Result:</span>
              <code>CONFIG_DB → PORT|Ethernet0 → admin_status: &quot;up&quot;</code>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 8: ANNOTATION TYPES COMPARED                      */}
      {/* ======================================================== */}
      <section data-section="annotation-types" id="annotation-types" className="scroll-mt-20">
        <h2>8. How Annotation Differs Per Transformer Type</h2>
        <p>
          The same <code>deviation</code> block can use <strong>different extensions</strong> depending
          on how complex the mapping is. Here&apos;s a visual comparison:
        </p>

        {/* Side-by-side cards */}
        <div className="space-y-4 my-6">
          {/* DIRECT (no transformer) */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl border overflow-hidden" style={{ borderColor: "#10b98130" }}
          >
            <div className="px-4 py-2.5 flex items-center gap-3" style={{ background: "#10b98112" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: "#10b981" }}>1</div>
              <div className="text-xs font-bold" style={{ color: "#10b981" }}>Direct Mapping (field-name only)</div>
              <div className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#10b98115", color: "#10b981" }}>Simplest</div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ background: "var(--bg-card)" }}>
              <div>
                <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--text-tertiary)" }}>Annotation</div>
                <div className="font-mono text-[11px] rounded-lg p-3 space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
                  <div>deviation /oc-if:.../config/<span style={{ color: "#10b981" }}>mtu</span> {"{"}</div>
                  <div>{"  "}deviate add {"{"}</div>
                  <div>{"    "}<span style={{ color: "#10b981" }}>oc-ext:field-name &quot;mtu&quot;;</span></div>
                  <div>{"  "}{"}"}</div>
                  <div>{"}"}</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--text-tertiary)" }}>What happens</div>
                <div className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#3b82f610", color: "#3b82f6" }}>mtu = 9100</span>
                    <span style={{ color: "var(--text-tertiary)" }}>→</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#10b98110", color: "#10b981" }}>mtu: &quot;9100&quot;</span>
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>No Go code needed! Value copied as-is.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FIELD TRANSFORMER */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-2xl border overflow-hidden" style={{ borderColor: "#f59e0b30" }}
          >
            <div className="px-4 py-2.5 flex items-center gap-3" style={{ background: "#f59e0b12" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: "#f59e0b" }}>2</div>
              <div className="text-xs font-bold" style={{ color: "#f59e0b" }}>Field Transformer (value conversion)</div>
              <div className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#f59e0b15", color: "#f59e0b" }}>Per-leaf</div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ background: "var(--bg-card)" }}>
              <div>
                <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--text-tertiary)" }}>Annotation</div>
                <div className="font-mono text-[11px] rounded-lg p-3 space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
                  <div>deviation /oc-if:.../config/<span style={{ color: "#f59e0b" }}>enabled</span> {"{"}</div>
                  <div>{"  "}deviate add {"{"}</div>
                  <div>{"    "}oc-ext:field-name &quot;admin_status&quot;;</div>
                  <div>{"    "}<span style={{ color: "#f59e0b" }}>oc-ext:field-transformer &quot;intf_enabled_xfmr&quot;;</span></div>
                  <div>{"  "}{"}"}</div>
                  <div>{"}"}</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--text-tertiary)" }}>What happens</div>
                <div className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#3b82f610", color: "#3b82f6" }}>enabled = true</span>
                    <span className="text-[10px] font-bold" style={{ color: "#f59e0b" }}>→ Go func →</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#10b98110", color: "#10b981" }}>admin_status: &quot;up&quot;</span>
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Go function called for value conversion.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KEY TRANSFORMER */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="rounded-2xl border overflow-hidden" style={{ borderColor: "#06b6d430" }}
          >
            <div className="px-4 py-2.5 flex items-center gap-3" style={{ background: "#06b6d412" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: "#06b6d4" }}>3</div>
              <div className="text-xs font-bold" style={{ color: "#06b6d4" }}>Key Transformer (key format conversion)</div>
              <div className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#06b6d415", color: "#06b6d4" }}>Per-list</div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ background: "var(--bg-card)" }}>
              <div>
                <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--text-tertiary)" }}>Annotation</div>
                <div className="font-mono text-[11px] rounded-lg p-3 space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
                  <div>deviation /oc-vlan:vlans/<span style={{ color: "#06b6d4" }}>vlan</span> {"{"}</div>
                  <div>{"  "}deviate add {"{"}</div>
                  <div>{"    "}oc-ext:table-name &quot;VLAN&quot;;</div>
                  <div>{"    "}<span style={{ color: "#06b6d4" }}>oc-ext:key-transformer &quot;vlan_key_xfmr&quot;;</span></div>
                  <div>{"  "}{"}"}</div>
                  <div>{"}"}</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--text-tertiary)" }}>What happens</div>
                <div className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#3b82f610", color: "#3b82f6" }}>vlan[vlan-id=100]</span>
                    <span className="text-[10px] font-bold" style={{ color: "#06b6d4" }}>→ Go func →</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#10b98110", color: "#10b981" }}>VLAN|Vlan100</span>
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Go function builds Redis key from YANG list key.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* TABLE TRANSFORMER */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="rounded-2xl border overflow-hidden" style={{ borderColor: "#8b5cf630" }}
          >
            <div className="px-4 py-2.5 flex items-center gap-3" style={{ background: "#8b5cf612" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: "#8b5cf6" }}>4</div>
              <div className="text-xs font-bold" style={{ color: "#8b5cf6" }}>Table Transformer (dynamic table)</div>
              <div className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#8b5cf615", color: "#8b5cf6" }}>Replaces table-name</div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ background: "var(--bg-card)" }}>
              <div>
                <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--text-tertiary)" }}>Annotation</div>
                <div className="font-mono text-[11px] rounded-lg p-3 space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
                  <div>deviation /oc-if:interfaces/<span style={{ color: "#8b5cf6" }}>interface</span> {"{"}</div>
                  <div>{"  "}deviate add {"{"}</div>
                  <div>{"    "}<span style={{ color: "#ef4444" }}>// NO table-name here!</span></div>
                  <div>{"    "}<span style={{ color: "#8b5cf6" }}>oc-ext:table-transformer &quot;intf_table_xfmr&quot;;</span></div>
                  <div>{"  "}{"}"}</div>
                  <div>{"}"}</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--text-tertiary)" }}>What happens</div>
                <div className="space-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#3b82f610", color: "#3b82f6" }}>Ethernet0</span>
                    <span style={{ color: "var(--text-tertiary)" }}>→</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#10b98110", color: "#10b981" }}>PORT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#3b82f610", color: "#3b82f6" }}>Vlan100</span>
                    <span style={{ color: "var(--text-tertiary)" }}>→</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#10b98110", color: "#10b981" }}>VLAN</span>
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Go function decides table at runtime.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SUBTREE TRANSFORMER */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="rounded-2xl border overflow-hidden" style={{ borderColor: "#ef444430" }}
          >
            <div className="px-4 py-2.5 flex items-center gap-3" style={{ background: "#ef444412" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: "#ef4444" }}>5</div>
              <div className="text-xs font-bold" style={{ color: "#ef4444" }}>Subtree Transformer (handles entire branch)</div>
              <div className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#ef444415", color: "#ef4444" }}>Most complex</div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ background: "var(--bg-card)" }}>
              <div>
                <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--text-tertiary)" }}>Annotation</div>
                <div className="font-mono text-[11px] rounded-lg p-3 space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
                  <div>deviation /oc-acl:acl/<span style={{ color: "#ef4444" }}>acl-sets</span> {"{"}</div>
                  <div>{"  "}deviate add {"{"}</div>
                  <div>{"    "}<span style={{ color: "#ef4444" }}>oc-ext:subtree-transformer &quot;acl_xfmr&quot;;</span></div>
                  <div>{"    "}<span style={{ color: "#ef4444" }}>// NO table-name, NO field-name</span></div>
                  <div>{"    "}<span style={{ color: "#ef4444" }}>// The Go func handles EVERYTHING</span></div>
                  <div>{"  "}{"}"}</div>
                  <div>{"}"}</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--text-tertiary)" }}>What happens</div>
                <div className="space-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <div>Go function reads/writes <strong>multiple tables</strong>:</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#ef444410", color: "#ef4444" }}>ACL_TABLE</span>
                    <span>+</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#ef444410", color: "#ef4444" }}>ACL_RULE</span>
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Bypasses annotation engine for child nodes.</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 9: BACKEND INVOCATION                             */}
      {/* ======================================================== */}
      <section data-section="backend-invocation" id="backend-invocation" className="scroll-mt-20">
        <h2>9. Backend: How Translib Invokes Transformers</h2>
        <p>
          This is what happens <strong>inside the Go code</strong> when a gNMI request arrives.
        </p>

        {/* Visual: Registration → Lookup → Call */}
        <FlowDiagram
          title="Transformer Lifecycle"
          steps={[
            { label: "Register", sublabel: "init() at startup", color: "#3b82f6", detail: "XlateFuncBind(name, fn)" },
            { label: "Store", sublabel: "in global map", color: "#8b5cf6", detail: "map[string]XfmrFunc" },
            { label: "Lookup", sublabel: "on each request", color: "#06b6d4", detail: "find by name string" },
            { label: "Call", sublabel: "execute func", color: "#f59e0b", detail: "fn(XfmrParams)" },
            { label: "Result", sublabel: "map[string]string", color: "#10b981", detail: "write to Redis" },
          ]}
        />

        <AnnotatedCodeBlock
          title="translib/transformer/xlate.go (simplified)"
          language="go"
          lines={[
            { code: "// STEP 1: Global registry — map of name → function", annotation: "Stores all registered transformers" },
            { code: "var xfmrTbl = map[string]interface{}{}", highlight: true, color: "#3b82f6" },
            { code: "" },
            { code: "// STEP 2: Registration function (called from init())", annotation: "Each transformer Go file calls this" },
            { code: "func XlateFuncBind(name string, fn interface{}) {", highlight: true, color: "#8b5cf6" },
            { code: "    xfmrTbl[name] = fn", annotation: "Store fn with the given name" },
            { code: "}" },
            { code: "" },
            { code: "// STEP 3: On request — Translib calls this to invoke", annotation: "Called when processing gNMI SET/GET" },
            { code: "func callKeyXfmr(name string, params XfmrParams) (string, error) {", highlight: true, color: "#06b6d4" },
            { code: "    fn, exists := xfmrTbl[name]", annotation: "Look up the function by name" },
            { code: "    if !exists {" },
            { code: "        return \"\", fmt.Errorf(\"transformer %s not found\", name)", annotation: "Error if name not registered!" },
            { code: "    }" },
            { code: "    keyFn := fn.(KeyXfmrFunc)", annotation: "Type-assert to KeyXfmrFunc" },
            { code: "    return keyFn(params)", annotation: "Execute and return the result", highlight: true, color: "#10b981" },
            { code: "}" },
          ]}
        />

        {/* Visual execution order */}
        <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            ⚡ Execution Order on Each Request
          </h4>
          <div className="space-y-2">
            {[
              { order: "1st", name: "Table Transformer", when: "if oc-ext:table-transformer exists", returns: "[]string{\"PORT\"}", color: "#8b5cf6" },
              { order: "2nd", name: "Key Transformer", when: "if oc-ext:key-transformer exists", returns: "\"Ethernet0\"", color: "#06b6d4" },
              { order: "3rd", name: "Pre Transformer", when: "if sonic-ext:pre-transformer exists", returns: "validation / auth check", color: "#f97316" },
              { order: "4th", name: "Field Transformer", when: "if oc-ext:field-transformer exists (per leaf)", returns: "map{\"admin_status\": \"up\"}", color: "#f59e0b" },
              { order: "5th", name: "Post Transformer", when: "if sonic-ext:post-transformer exists", returns: "cross-field validation", color: "#ec4899" },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ background: item.color }}>
                  {item.order}
                </div>
                <div className="flex-1 rounded-lg px-3 py-2" style={{ background: `${item.color}06`, border: `1px solid ${item.color}15` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: item.color }}>{item.name}</span>
                    <code className="text-[9px] hidden sm:block" style={{ color: "var(--text-tertiary)" }}>{item.returns}</code>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.when}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-[10px] mt-4 p-2 rounded-lg text-center" style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
            ⚠️ Subtree transformer <strong>replaces all of the above</strong> — it runs alone and handles everything.
          </div>
        </div>

        {/* XfmrParams visual */}
        <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)" }}>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            📦 What&apos;s inside <code>XfmrParams</code>?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { field: "uri", value: "/interfaces/interface[name=Ethernet0]/config/enabled", desc: "Full gNMI path" },
              { field: "oper", value: "GET or SET", desc: "Read or write direction" },
              { field: "param", value: "true (for SET) or \"up\" (for GET)", desc: "The value being transformed" },
              { field: "key", value: "\"Ethernet0\"", desc: "Already-extracted list key" },
              { field: "dbs", value: "[ConfigDB, ApplDB, StateDB, ...]", desc: "DB connections for reads" },
              { field: "requestUri", value: "original full request path", desc: "The top-level gNMI path" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg px-3 py-2 text-xs" style={{ background: "var(--bg-code)" }}>
                <code className="font-bold" style={{ color: "#3b82f6" }}>.{item.field}</code>
                <div className="mt-0.5 font-mono text-[10px]" style={{ color: "var(--text-secondary)" }}>{item.value}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 10: VERIFY ANNOTATION                             */}
      {/* ======================================================== */}
      <section data-section="verify-annotation" id="verify-annotation" className="scroll-mt-20">
        <h2>10. How to Verify Annotation is Correct</h2>
        <p>
          Follow this checklist to confirm your annotation is mapped correctly:
        </p>

        <div className="space-y-3 my-6">
          {[
            {
              check: "Annotation loads without errors",
              how: "Check syslog at startup — Translib logs all annotation parse errors",
              pass: "No YANG errors in syslog after restart",
              fail: "\"deviation target not found\" = wrong path prefix",
              color: "#ef4444",
            },
            {
              check: "Transformer name matches registration",
              how: "The string in oc-ext:field-transformer \"xxx\" must exactly match XlateFuncBind(\"xxx\", ...)",
              pass: "Names are identical (case-sensitive)",
              fail: "\"transformer xxx not found\" = typo in name",
              color: "#f59e0b",
            },
            {
              check: "Path uses module prefix on every node",
              how: "Every element in the deviation path must have its module prefix",
              pass: "/oc-if:interfaces/oc-if:interface/oc-if:config/oc-if:enabled ✓",
              fail: "/interfaces/interface/config/enabled ✗ (missing oc-if:)",
              color: "#8b5cf6",
            },
            {
              check: "Redis key is correct format",
              how: "Use redis-cli to check: KEYS TABLE|* and compare with transformer output",
              pass: "redis-cli -n 4 HGETALL \"PORT|Ethernet0\" returns data",
              fail: "Key exists but wrong table (PORT vs PORT_TABLE)",
              color: "#06b6d4",
            },
            {
              check: "Field value transforms both ways",
              how: "Test SET then GET — value must round-trip correctly",
              pass: "SET true → GET returns true (via up → true)",
              fail: "SET true works but GET returns wrong value = GET direction broken",
              color: "#10b981",
            },
            {
              check: "Correct Redis database targeted",
              how: "Config goes to CONFIG_DB (4), oper state goes to APPL_DB (0)",
              pass: "db-name matches where the data actually lives",
              fail: "Reading oper-status from CONFIG_DB (should be APPL_DB)",
              color: "#3b82f6",
            },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: `${item.color}25` }}
            >
              <div className="px-4 py-2 flex items-center gap-2" style={{ background: `${item.color}08` }}>
                <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: item.color }}>
                  {i + 1}
                </div>
                <span className="text-xs font-semibold" style={{ color: item.color }}>{item.check}</span>
              </div>
              <div className="px-4 py-3 space-y-1.5" style={{ background: "var(--bg-card)" }}>
                <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{item.how}</div>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 rounded-lg px-2 py-1.5" style={{ background: "#10b98108", border: "1px solid #10b98115" }}>
                    <div className="text-[9px] font-bold" style={{ color: "#10b981" }}>✓ PASS</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.pass}</div>
                  </div>
                  <div className="flex-1 rounded-lg px-2 py-1.5" style={{ background: "#ef444408", border: "1px solid #ef444415" }}>
                    <div className="text-[9px] font-bold" style={{ color: "#ef4444" }}>✗ FAIL</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.fail}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 11: SUBTREE TRANSFORMER E2E                       */}
      {/* ======================================================== */}
      <section data-section="subtree-e2e" id="subtree-e2e" className="scroll-mt-20">
        <h2>11. Subtree Transformer: End-to-End</h2>
        <p>
          A subtree transformer <strong>takes over an entire YANG branch</strong> and handles
          all mapping itself. No field-name, no key-transformer — one function does it all.
          Here&apos;s a real example: <strong>ACL (Access Control List)</strong> mapping.
        </p>

        {/* Why subtree is needed */}
        <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "#ef444430", background: "#ef444405" }}>
          <h4 className="text-xs font-bold mb-3" style={{ color: "#ef4444" }}>
            🤔 Why can&apos;t we use simple field-name here?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>OpenConfig (1 tree)</div>
              <div className="font-mono text-[10px] p-2 rounded-lg space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
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
              <div className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>SONiC (2 tables!)</div>
              <div className="font-mono text-[10px] p-2 rounded-lg space-y-2" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
                <div>
                  <span style={{ color: "#3b82f6" }}>ACL_TABLE|MY_ACL</span>
                  <div className="ml-2">type: &quot;L3&quot;</div>
                  <div className="ml-2">policy_desc: &quot;My ACL&quot;</div>
                </div>
                <div>
                  <span style={{ color: "#f59e0b" }}>ACL_RULE|MY_ACL|RULE_10</span>
                  <div className="ml-2">SRC_IP: &quot;10.0.0.0/8&quot;</div>
                  <div className="ml-2">PACKET_ACTION: &quot;FORWARD&quot;</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[10px] mt-3" style={{ color: "var(--text-tertiary)" }}>
            One OpenConfig tree maps to <strong>2 different Redis tables</strong> → simple annotation can&apos;t do this!
          </div>
        </div>

        {/* Annotation */}
        <h3>The Annotation</h3>
        <AnnotatedCodeBlock
          title="openconfig-acl-annot.yang"
          language="yang"
          lines={[
            { code: "deviation /oc-acl:acl/oc-acl:acl-sets {", annotation: "Target: the acl-sets container", highlight: true, color: "#ef4444" },
            { code: "  deviate add {" },
            { code: "    oc-ext:subtree-transformer \"acl_sets_xfmr\";", annotation: "One function handles the ENTIRE subtree", highlight: true, color: "#ef4444" },
            { code: "    // NO table-name", annotation: "Subtree xfmr decides tables itself" },
            { code: "    // NO field-name", annotation: "Subtree xfmr maps all fields" },
            { code: "    // NO key-transformer", annotation: "Subtree xfmr builds all keys" },
            { code: "  }" },
            { code: "}" },
          ]}
        />

        {/* Transformer Code */}
        <h3>The Subtree Transformer Code</h3>
        <AnnotatedCodeBlock
          title="acl_sets_xfmr.go"
          language="go"
          lines={[
            { code: "func init() {" },
            { code: "    XlateFuncBind(\"acl_sets_xfmr\", acl_sets_xfmr)", annotation: "Register (same pattern as any transformer)" },
            { code: "}" },
            { code: "" },
            { code: "var acl_sets_xfmr SubtreeXfmrFunc = func(", annotation: "SubtreeXfmrFunc = handles entire branch", highlight: true, color: "#ef4444" },
            { code: "    inParams XfmrParams," },
            { code: ") (map[string]map[string]db.Value, error) {", annotation: "Returns: map[table][key] → fields", highlight: true, color: "#10b981" },
            { code: "    result := make(map[string]map[string]db.Value)" },
            { code: "" },
            { code: "    if inParams.oper == SET {", annotation: "Write direction: OC → Redis", highlight: true, color: "#f59e0b" },
            { code: "        aclName := extractAclName(inParams.uri)", annotation: "Get \"MY_ACL\" from path" },
            { code: "        aclData := parseInput(inParams.param)", annotation: "Parse the OpenConfig input" },
            { code: "" },
            { code: "        // Write to TABLE 1: ACL_TABLE", annotation: "Map acl-set config → ACL_TABLE", highlight: true, color: "#3b82f6" },
            { code: "        result[\"ACL_TABLE\"] = map[string]db.Value{" },
            { code: "            aclName: {Field: map[string]string{" },
            { code: "                \"type\":        \"L3\",", annotation: "OpenConfig type → SONiC type" },
            { code: "                \"policy_desc\": aclData.Description," },
            { code: "            }}," },
            { code: "        }" },
            { code: "" },
            { code: "        // Write to TABLE 2: ACL_RULE", annotation: "Map acl-entries → ACL_RULE", highlight: true, color: "#f59e0b" },
            { code: "        result[\"ACL_RULE\"] = make(map[string]db.Value)" },
            { code: "        for _, rule := range aclData.Rules {" },
            { code: "            ruleKey := fmt.Sprintf(\"%s|RULE_%d\",", annotation: "Build compound key" },
            { code: "                aclName, rule.SeqId)" },
            { code: "            result[\"ACL_RULE\"][ruleKey] = db.Value{" },
            { code: "                Field: map[string]string{" },
            { code: "                    \"SRC_IP\":        rule.SrcIP,", annotation: "Map each OC field → SONiC field" },
            { code: "                    \"PACKET_ACTION\": rule.Action," },
            { code: "                    \"PRIORITY\":      fmt.Sprintf(\"%d\", rule.SeqId)," },
            { code: "                }," },
            { code: "            }" },
            { code: "        }" },
            { code: "" },
            { code: "    } else {", annotation: "Read direction: Redis → OC", highlight: true, color: "#3b82f6" },
            { code: "        // Read from BOTH tables and merge into OC tree" },
            { code: "        // (reverse of above)" },
            { code: "    }" },
            { code: "" },
            { code: "    return result, nil", annotation: "Return multi-table result", highlight: true, color: "#10b981" },
            { code: "}" },
          ]}
        />

        {/* E2E Flow for subtree */}
        <h3>Subtree SET Flow: Step by Step</h3>
        <StepByStep
          steps={[
            {
              title: "gNMI SET: Create ACL with 1 rule",
              description: "Client sends an ACL set with name 'MY_ACL', type L3, and one rule allowing 10.0.0.0/8.",
              before: "/acl/acl-sets/acl-set[name=MY_ACL]",
              after: "{ type: L3, rules: [{ seq: 10, src: 10.0.0.0/8, action: ACCEPT }] }",
              color: "#3b82f6",
            },
            {
              title: "Annotation engine finds subtree-transformer",
              description: "Sees oc-ext:subtree-transformer \"acl_sets_xfmr\" — skips ALL normal mapping, calls this function directly.",
              before: "deviation /oc-acl:acl/oc-acl:acl-sets",
              after: "→ call acl_sets_xfmr(params)",
              color: "#8b5cf6",
            },
            {
              title: "Subtree function parses OC input",
              description: "The Go function receives the entire OpenConfig subtree and extracts all fields: name, type, rules, source-address, action.",
              color: "#06b6d4",
            },
            {
              title: "Writes to ACL_TABLE",
              description: "Creates the ACL table entry with the ACL metadata.",
              before: "aclName = \"MY_ACL\"",
              after: "ACL_TABLE|MY_ACL → type: \"L3\", policy_desc: \"My ACL\"",
              color: "#f59e0b",
            },
            {
              title: "Writes to ACL_RULE",
              description: "Creates a rule entry with a compound key: ACL_name|RULE_sequence.",
              before: "rule seq=10, src=10.0.0.0/8",
              after: "ACL_RULE|MY_ACL|RULE_10 → SRC_IP, PACKET_ACTION",
              color: "#ec4899",
            },
            {
              title: "Both tables written to CONFIG_DB",
              description: "Translib writes both table entries in a single Redis transaction.",
              after: "✓ ACL_TABLE + ACL_RULE saved atomically",
              color: "#10b981",
            },
          ]}
        />

        {/* Final Redis state */}
        <h3>Redis DB After Subtree Write</h3>
        <div className="space-y-3 my-6">
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-xl border p-4" style={{ borderColor: "#3b82f625", background: "#3b82f605" }}
          >
            <div className="font-mono text-xs">
              <div className="font-bold mb-1.5" style={{ color: "#3b82f6" }}>ACL_TABLE|MY_ACL</div>
              <div className="space-y-0.5" style={{ color: "var(--text-secondary)" }}>
                <div>type: &quot;L3&quot;</div>
                <div>policy_desc: &quot;My ACL&quot;</div>
                <div>stage: &quot;INGRESS&quot;</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-xl border p-4" style={{ borderColor: "#f59e0b25", background: "#f59e0b05" }}
          >
            <div className="font-mono text-xs">
              <div className="font-bold mb-1.5" style={{ color: "#f59e0b" }}>ACL_RULE|MY_ACL|RULE_10</div>
              <div className="space-y-0.5" style={{ color: "var(--text-secondary)" }}>
                <div>SRC_IP: &quot;10.0.0.0/8&quot;</div>
                <div>PACKET_ACTION: &quot;FORWARD&quot;</div>
                <div>PRIORITY: &quot;10&quot;</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="rounded-2xl border p-5 my-6" style={{ borderColor: "rgba(239, 68, 68, 0.3)", background: "rgba(239, 68, 68, 0.05)" }}>
          <p className="text-sm leading-relaxed m-0" style={{ color: "var(--text-secondary)" }}>
            <strong style={{ color: "#ef4444" }}>🔑 Key Takeaway:</strong> Subtree transformers are used
            when <strong>one OpenConfig path writes to multiple Redis tables</strong>. The Go function
            returns <code>map[tableName][key] → fields</code> — Translib writes all tables in one transaction.
            Use subtree only when field/key/table transformers can&apos;t handle the complexity.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
