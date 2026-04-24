"use client";
import React from "react";
import { motion } from "framer-motion";
import WPageNav from "@/components/guide/WPageNav";

export default function RedisOutputPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section id="redis-output">
        <h2 className="!mt-0">7. Redis DB — Final State</h2>
        <p>After the SET flow completes, this is what exists in each Redis database. Our <code>enabled</code> example writes to <strong>CONFIG_DB</strong> only.</p>

        <div className="space-y-4 my-6 not-prose">
          {[
            { db: "CONFIG_DB (Redis DB 4)", note: "Persistent config — survives reboot", color: "#10b981",
              entries: [{ key: "PORT|Ethernet0", fields: [{ f: "admin_status", v: '"up"', note: "← our mapped field!" }, { f: "mtu", v: '"9100"', note: "direct field-name" }, { f: "speed", v: '"40000"', note: "uses speed transformer" }] }] },
            { db: "APPL_DB (Redis DB 0)", note: "Volatile oper state — set by apps", color: "#3b82f6",
              entries: [{ key: "PORT_TABLE:Ethernet0", fields: [{ f: "oper_status", v: '"up"', note: '← read via db-name "APPL_DB"' }, { f: "speed", v: '"40000"', note: "" }] }] },
            { db: "STATE_DB (Redis DB 6)", note: "Hardware/System state — read-only", color: "#8b5cf6",
              entries: [{ key: "PORT_TABLE|Ethernet0", fields: [{ f: "netdev_oper_status", v: '"up"', note: "← physical link state" }] }] },
          ].map((db, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor: `${db.color}30` }}>
              <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: `${db.color}12` }}>
                <div className="text-xs font-bold" style={{ color: db.color }}>{db.db}</div>
                <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{db.note}</div>
              </div>
              <div className="p-4" style={{ background: "var(--bg-card)" }}>
                {db.entries.map((entry, j) => (
                  <div key={j} className="rounded-lg p-3 font-mono text-xs" style={{ background: "var(--bg-code)" }}>
                    <div className="font-bold mb-2" style={{ color: db.color }}>{entry.key}</div>
                    {entry.fields.map((f, k) => (
                      <div key={k} className="flex items-center gap-2 py-0.5">
                        <span style={{ color: "#3b82f6" }}>{f.f}</span>
                        <span style={{ color: "var(--text-secondary)" }}>: {f.v}</span>
                        {f.note && <span className="text-[10px] italic" style={{ color: "var(--text-tertiary)" }}>{f.note}</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-5 my-5 not-prose" style={{ borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.05)" }}>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "#3b82f6" }}>📌 Complete Mapping Summary</h4>
          <div className="text-xs space-y-1.5" style={{ color: "var(--text-secondary)" }}>
            {[
              ["YANG Model", "openconfig-interfaces → leaf enabled (boolean)"],
              ["Annotation", 'table-name="PORT", field-name="admin_status"'],
              ["Key Xfmr", 'intf_tbl_key_xfmr → extracts "Ethernet0"'],
              ["Field Xfmr", 'intf_enabled_xfmr → true↔"up", false↔"down"'],
              ["Redis Result", 'CONFIG_DB → PORT|Ethernet0 → admin_status: "up"'],
            ].map(([label, val]) => (
              <div key={label} className="flex gap-2">
                <span className="font-semibold w-28 shrink-0" style={{ color: "var(--text-primary)" }}>{label}:</span>
                <code className="text-[10px]">{val}</code>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WPageNav prev={{ title: "GET Flow", slug: "get-flow" }} next={{ title: "Backend Invocation", slug: "backend-invocation" }} />
    </motion.div>
  );
}
