"use client";
import React from "react";
import { motion } from "framer-motion";

export default function CheatsheetSection() {
  return (
    <section data-section="cheatsheet" id="cheatsheet" className="scroll-mt-20">
      <h2>10. Quick-Reference Cheatsheet</h2>
      <p>Everything you need on one page. Copy any snippet below directly into your annotation file.</p>

      {/* Template snippets */}
      <div className="space-y-4 my-6">
        {/* Template 1: Direct */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl border overflow-hidden" style={{ borderColor: "#10b98125" }}>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "#10b98110" }}>
            <span className="text-xs font-bold" style={{ color: "#10b981" }}>Template 1 — Direct Mapping (simplest)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#10b98118", color: "#10b981" }}>No Go needed</span>
          </div>
          <div className="p-4 font-mono text-[11px] space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
            <div><span style={{ color: "#8b5cf6" }}>module</span> openconfig-&lt;model&gt;-annot {"{"}</div>
            <div>&nbsp;&nbsp;<span style={{ color: "#8b5cf6" }}>import</span> openconfig-&lt;model&gt; {"{"} prefix &lt;pfx&gt;; {"}"}</div>
            <div>&nbsp;&nbsp;<span style={{ color: "#8b5cf6" }}>import</span> openconfig-extensions {"{"} prefix oc-ext; {"}"}</div>
            <div>&nbsp;&nbsp;<span style={{ color: "#06b6d4" }}>deviation</span> /&lt;pfx&gt;:&lt;list-path&gt; {"{"}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;deviate add {"{"}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#10b981" }}>oc-ext:table-name</span> &quot;&lt;TABLE&gt;&quot;;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#10b981" }}>oc-ext:key-transformer</span> &quot;&lt;key_xfmr_fn&gt;&quot;;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</div>
            <div>&nbsp;&nbsp;{"}"}</div>
            <div>&nbsp;&nbsp;<span style={{ color: "#06b6d4" }}>deviation</span> /&lt;pfx&gt;:&lt;list-path&gt;/&lt;pfx&gt;:config/&lt;pfx&gt;:&lt;leaf&gt; {"{"}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;deviate add {"{"}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#10b981" }}>oc-ext:field-name</span> &quot;&lt;redis_field&gt;&quot;;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</div>
            <div>&nbsp;&nbsp;{"}"}</div>
            <div>{"}"}</div>
          </div>
        </motion.div>

        {/* Template 2: Field transformer */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="rounded-2xl border overflow-hidden" style={{ borderColor: "#f59e0b25" }}>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "#f59e0b10" }}>
            <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>Template 2 — Field Transformer (value conversion)</span>
          </div>
          <div className="p-4 font-mono text-[11px] space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
            <div><span style={{ color: "#06b6d4" }}>deviation</span> /&lt;pfx&gt;:&lt;list&gt;/&lt;pfx&gt;:config/&lt;pfx&gt;:&lt;leaf&gt; {"{"}</div>
            <div>&nbsp;&nbsp;deviate add {"{"}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#10b981" }}>oc-ext:field-name</span> &quot;&lt;redis_field&gt;&quot;;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#f59e0b" }}>oc-ext:field-transformer</span> &quot;&lt;fn_name&gt;&quot;;</div>
            <div>&nbsp;&nbsp;{"}"}</div>
            <div>{"}"}</div>
          </div>
        </motion.div>

        {/* Template 3: Table transformer */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          className="rounded-2xl border overflow-hidden" style={{ borderColor: "#8b5cf625" }}>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "#8b5cf610" }}>
            <span className="text-xs font-bold" style={{ color: "#8b5cf6" }}>Template 3 — Table Transformer (dynamic table)</span>
          </div>
          <div className="p-4 font-mono text-[11px] space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
            <div><span style={{ color: "#06b6d4" }}>deviation</span> /&lt;pfx&gt;:&lt;list&gt; {"{"}</div>
            <div>&nbsp;&nbsp;deviate add {"{"}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#8b5cf6" }}>oc-ext:table-transformer</span> &quot;&lt;fn_name&gt;&quot;;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#10b981" }}>oc-ext:key-transformer</span> &quot;&lt;key_fn&gt;&quot;;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ef4444" }}>// do NOT use table-name here</span></div>
            <div>&nbsp;&nbsp;{"}"}</div>
            <div>{"}"}</div>
          </div>
        </motion.div>

        {/* Template 4: Subtree transformer */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="rounded-2xl border overflow-hidden" style={{ borderColor: "#ef444425" }}>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "#ef444410" }}>
            <span className="text-xs font-bold" style={{ color: "#ef4444" }}>Template 4 — Subtree Transformer (full ownership)</span>
          </div>
          <div className="p-4 font-mono text-[11px] space-y-0.5" style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}>
            <div><span style={{ color: "#06b6d4" }}>deviation</span> /&lt;pfx&gt;:&lt;container-or-list&gt; {"{"}</div>
            <div>&nbsp;&nbsp;deviate add {"{"}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ef4444" }}>oc-ext:subtree-transformer</span> &quot;&lt;fn_name&gt;&quot;;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "var(--text-tertiary)" }}>// no table-name, field-name, key-transformer</span></div>
            <div>&nbsp;&nbsp;{"}"}</div>
            <div>{"}"}</div>
          </div>
        </motion.div>
      </div>

      {/* Go function templates */}
      <h3>Go Transformer Templates</h3>
      <div className="space-y-4">
        {[
          {
            title: "Key Transformer",
            c: "#06b6d4",
            code: [
              'func init() { XlateFuncBind("<name>", <fn_name>) }',
              '',
              'var <fn_name> KeyXfmrFunc = func(inParams XfmrParams) (string, error) {',
              '    pathInfo := NewPathInfo(inParams.uri)',
              '    key := pathInfo.Var("<yang-key-name>")',
              '    if key == "" { return "", errors.New("key empty") }',
              '    return key, nil  // or transform: return "Vlan" + key, nil',
              '}',
            ],
          },
          {
            title: "Field Transformer",
            c: "#f59e0b",
            code: [
              'func init() { XlateFuncBind("<name>", <fn_name>) }',
              '',
              'var <fn_name> FieldXfmrFunc = func(inParams XfmrParams) (map[string]string, error) {',
              '    result := make(map[string]string)',
              '    if inParams.oper == GET {',
              '        val := inParams.param.(string)  // Redis value',
              '        result["<oc-leaf>"] = convert(val)  // → OC value',
              '    } else {  // SET',
              '        val := inParams.param.(<oc-type>)  // OC value',
              '        result["<redis-field>"] = convert(val)  // → Redis value',
              '    }',
              '    return result, nil',
              '}',
            ],
          },
          {
            title: "Table Transformer",
            c: "#8b5cf6",
            code: [
              'func init() { XlateFuncBind("<name>", <fn_name>) }',
              '',
              'var <fn_name> TableXfmrFunc = func(inParams XfmrParams) ([]string, error) {',
              '    pathInfo := NewPathInfo(inParams.uri)',
              '    key := pathInfo.Var("<yang-key>")',
              '    switch {',
              '    case strings.HasPrefix(key, "Ethernet"): return []string{"PORT"}, nil',
              '    case strings.HasPrefix(key, "Vlan"):     return []string{"VLAN"}, nil',
              '    default: return nil, fmt.Errorf("unknown: %s", key)',
              '    }',
              '}',
            ],
          },
          {
            title: "Subtree Transformer",
            c: "#ef4444",
            code: [
              'func init() { XlateFuncBind("<name>", <fn_name>) }',
              '',
              'var <fn_name> SubtreeXfmrFunc = func(inParams XfmrParams) (map[string]map[string]db.Value, error) {',
              '    result := make(map[string]map[string]db.Value)',
              '    if inParams.oper == SET {',
              '        // 1. Extract keys from path',
              '        // 2. Parse inParams.param (OC struct)',
              '        // 3. Populate result["TABLE"]["KEY"] = db.Value{Field: map}',
              '    } else { // GET',
              '        // 1. Read from inParams.dbs[db.ConfigDB]',
              '        // 2. Populate ygRoot OC tree',
              '    }',
              '    return result, nil',
              '}',
            ],
          },
        ].map((tmpl, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl border overflow-hidden" style={{ borderColor: `${tmpl.c}25` }}>
            <div className="px-4 py-2" style={{ background: `${tmpl.c}10` }}>
              <span className="text-xs font-bold" style={{ color: tmpl.c }}>Go: {tmpl.title}</span>
            </div>
            <div className="p-4 font-mono text-[11px]" style={{ background: "var(--bg-code)" }}>
              {tmpl.code.map((line, li) => (
                <div key={li} style={{ color: line.startsWith("//") || line.includes("//") ? "var(--text-tertiary)" : "var(--text-secondary)", minHeight: line === "" ? "1rem" : undefined }}>
                  {line}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Final summary card */}
      <div className="rounded-2xl border p-6 my-8" style={{ borderColor: "rgba(59, 130, 246, 0.3)", background: "rgba(59, 130, 246, 0.04)" }}>
        <h3 className="!mt-0 !mb-4" style={{ color: "#3b82f6" }}>🎓 You Can Now Write Annotations!</h3>
        <div className="text-sm space-y-2" style={{ color: "var(--text-secondary)" }}>
          <p>You have learned every part of the SONiC OpenConfig Annotation Framework:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Annotation file structure, naming, skeleton, and 4 golden rules</li>
            <li>All 10 oc-ext extensions and when to use each</li>
            <li>Direct mapping — no Go needed, just field-name</li>
            <li>Key transformer — converts YANG list key to Redis key</li>
            <li>Field transformer — bidirectional value conversion (SET + GET)</li>
            <li>Table transformer — dynamic Redis table routing at runtime</li>
            <li>Subtree transformer — full ownership of multi-table OC branches</li>
            <li>Pre/Post transformers — validation hooks and cross-field side effects</li>
            <li>Decision tree — how to choose the right transformer</li>
            <li>8-point verification checklist and top 5 common bugs</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
