"use client";
import React from "react";
import { motion } from "framer-motion";
import WPageNav from "@/components/guide/WPageNav";

const checks = [
  { check: "Annotation loads without errors", how: "Check syslog at startup — Translib logs all annotation parse errors", pass: "No YANG errors in syslog after restart", fail: '"deviation target not found" = wrong path prefix', color: "#ef4444" },
  { check: "Transformer name matches registration", how: 'The string in oc-ext:field-transformer "xxx" must exactly match XlateFuncBind("xxx", ...)', pass: "Names are identical (case-sensitive)", fail: '"transformer xxx not found" = typo in name', color: "#f59e0b" },
  { check: "Path uses module prefix on every node", how: "Every element in the deviation path must have its module prefix", pass: "/oc-if:interfaces/oc-if:interface/oc-if:config/oc-if:enabled ✓", fail: "/interfaces/interface/config/enabled ✗ (missing oc-if:)", color: "#8b5cf6" },
  { check: "Redis key is correct format", how: "Use redis-cli to check: KEYS TABLE|* and compare with transformer output", pass: 'redis-cli -n 4 HGETALL "PORT|Ethernet0" returns data', fail: "Key exists but wrong table (PORT vs PORT_TABLE)", color: "#06b6d4" },
  { check: "Field value transforms both ways", how: "Test SET then GET — value must round-trip correctly", pass: 'SET true → GET returns true (via up → true)', fail: "SET true works but GET returns wrong value = GET direction broken", color: "#10b981" },
  { check: "Correct Redis database targeted", how: "Config goes to CONFIG_DB (4), oper state goes to APPL_DB (0)", pass: "db-name matches where the data actually lives", fail: "Reading oper-status from CONFIG_DB (should be APPL_DB)", color: "#3b82f6" },
];

export default function VerifyAnnotationPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="verify-annotation">
        <h2 className="!mt-0">9. How to Verify Annotation is Correct</h2>
        <p>Follow this checklist to confirm your annotation is mapped correctly. Each check has a concrete command or observation.</p>

        <div className="space-y-3 my-6 not-prose">
          {checks.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="rounded-xl border overflow-hidden" style={{ borderColor: `${item.color}25` }}>
              <div className="px-4 py-2 flex items-center gap-2" style={{ background: `${item.color}08` }}>
                <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: item.color }}>{i + 1}</div>
                <span className="text-xs font-semibold" style={{ color: item.color }}>{item.check}</span>
              </div>
              <div className="px-4 py-3 space-y-2" style={{ background: "var(--bg-card)" }}>
                <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{item.how}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="rounded-lg px-2 py-1.5" style={{ background: "#10b98108", border: "1px solid #10b98115" }}>
                    <div className="text-[9px] font-bold" style={{ color: "#10b981" }}>✓ PASS</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.pass}</div>
                  </div>
                  <div className="rounded-lg px-2 py-1.5" style={{ background: "#ef444408", border: "1px solid #ef444415" }}>
                    <div className="text-[9px] font-bold" style={{ color: "#ef4444" }}>✗ FAIL</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.fail}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <WPageNav prev={{ title: "Backend Invocation", slug: "backend-invocation" }} />
    </motion.div>
  );
}
