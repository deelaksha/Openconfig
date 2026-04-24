"use client";
import React from "react";
import { motion } from "framer-motion";

export default function VerificationSection() {
  const checks = [
    {
      n: 1, check: "Annotation file loads without YANG errors",
      how: "Run Translib and check syslog at startup — all annotation parse errors are logged",
      pass: "No 'deviation target not found' or 'module import failed' errors in syslog",
      fail: "'deviation target not found' → wrong path prefix (missing oc-if: on a node)",
      c: "#ef4444",
    },
    {
      n: 2, check: "Transformer name matches XlateFuncBind exactly",
      how: "Search Go file for XlateFuncBind and compare string to annotation value",
      pass: "oc-ext:field-transformer \"intf_enabled_xfmr\" matches XlateFuncBind(\"intf_enabled_xfmr\", ...)",
      fail: "'transformer intf_enabled_Xfmr not found' → case mismatch or typo",
      c: "#f59e0b",
    },
    {
      n: 3, check: "Every node in deviation path has its module prefix",
      how: "Check each / separated segment has prefix: /oc-if:interfaces/oc-if:interface/oc-if:config/...",
      pass: "/oc-if:interfaces/oc-if:interface/oc-if:config/oc-if:enabled ✓",
      fail: "/interfaces/interface/config/enabled ✗ — missing prefix causes 'deviation target not found'",
      c: "#8b5cf6",
    },
    {
      n: 4, check: "Redis key format is correct",
      how: "Use redis-cli -n 4 KEYS 'PORT|*' and HGETALL 'PORT|Ethernet0' after a SET",
      pass: "redis-cli HGETALL 'PORT|Ethernet0' returns expected fields",
      fail: "Key not found → key transformer returned wrong string, or table name is wrong",
      c: "#06b6d4",
    },
    {
      n: 5, check: "Field value round-trips correctly",
      how: "SET a value via gNMI, then GET it back — value must match original",
      pass: "SET enabled=true → GET returns enabled=true (via up→true in GET direction)",
      fail: "SET works, GET returns wrong value → GET branch of field transformer is broken",
      c: "#10b981",
    },
    {
      n: 6, check: "Correct Redis database is targeted",
      how: "Config goes to db 4 (CONFIG_DB), oper state to db 0 (APPL_DB), HW state to db 6 (STATE_DB)",
      pass: "redis-cli -n 4 HGETALL 'PORT|Ethernet0' returns data (CONFIG_DB is db 4)",
      fail: "Data in wrong DB → add oc-ext:db-name \"APPL_DB\" to the annotation deviation block",
      c: "#3b82f6",
    },
    {
      n: 7, check: "Go file is in the 'transformer' package",
      how: "Check package declaration at top of .go file",
      pass: "package transformer ✓",
      fail: "package main or any other name → XlateFuncBind never called, transformer not registered",
      c: "#ec4899",
    },
    {
      n: 8, check: "init() function is present in Go transformer file",
      how: "Every transformer .go file must have an init() that calls XlateFuncBind",
      pass: "func init() { XlateFuncBind(\"name\", fn) } ✓",
      fail: "No init() → function never registered → 'transformer not found' at runtime",
      c: "#f97316",
    },
  ];

  return (
    <section data-section="verification" id="verification" className="scroll-mt-20">
      <h2>9. Verification Checklist</h2>
      <p>
        Run through every item below after writing your annotation. Each check has a concrete
        command or observation — not just theory.
      </p>

      <div className="space-y-3 my-6">
        {checks.map((item, i) => (
          <motion.div
            key={item.n}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: `${item.c}25` }}
          >
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2" style={{ background: `${item.c}08` }}>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold shrink-0"
                style={{ background: item.c }}>{item.n}</div>
              <span className="text-[11px] sm:text-xs font-semibold leading-tight" style={{ color: item.c }}>{item.check}</span>
            </div>
            <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-2" style={{ background: "var(--bg-card)" }}>
              <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                <strong style={{ color: "var(--text-primary)" }}>How to check: </strong>{item.how}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-lg px-3 py-2" style={{ background: "#10b98108", border: "1px solid #10b98118" }}>
                  <div className="text-[9px] font-bold mb-1" style={{ color: "#10b981" }}>✓ PASS looks like</div>
                  <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{item.pass}</div>
                </div>
                <div className="rounded-lg px-3 py-2" style={{ background: "#ef444408", border: "1px solid #ef444418" }}>
                  <div className="text-[9px] font-bold mb-1" style={{ color: "#ef4444" }}>✗ FAIL looks like</div>
                  <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{item.fail}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Common mistakes */}
      <div className="rounded-xl sm:rounded-2xl border p-3 sm:p-5 my-4 sm:my-6" style={{ borderColor: "#ef444430", background: "#ef444404" }}>
        <div className="text-xs font-bold mb-2 sm:mb-3" style={{ color: "#ef4444" }}>🐛 Top 5 Most Common Bugs</div>
        <div className="space-y-2">
          {[
            { bug: "Missing module prefix on a deviation path node", fix: "Add prefix to EVERY /node in the path: /oc-if:interfaces/oc-if:interface/oc-if:config/oc-if:enabled" },
            { bug: "Transformer name typo (wrong case, extra space)", fix: "Copy-paste the name from XlateFuncBind to the annotation string — do not type it twice" },
            { bug: "Forgot init() or XlateFuncBind in Go file", fix: "Every .go transformer file needs an init() that calls XlateFuncBind(\"name\", fn)" },
            { bug: "Using table-name AND table-transformer together", fix: "They are mutually exclusive — remove table-name when using table-transformer" },
            { bug: "Field transformer returns OC field name in SET direction (not Redis field name)", fix: "In SET: result map key = Redis field name. In GET: result map key = OC field name" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg p-3 text-xs" style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}>
              <div className="font-semibold mb-1" style={{ color: "#ef4444" }}>🐛 {item.bug}</div>
              <div style={{ color: "var(--text-secondary)" }}>💡 {item.fix}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
