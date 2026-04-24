"use client";
import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GUIDE_BASE } from "@/lib/annotation-guide-data";

interface PageNavProps {
  prev?: { title: string; slug: string };
  next?: { title: string; slug: string };
}

export default function PageNav({ prev, next }: PageNavProps) {
  const href = (slug: string) => slug === "" ? GUIDE_BASE : `${GUIDE_BASE}/${slug}`;

  return (
    <div className="flex items-center justify-between gap-4 mt-12 pt-6 border-t not-prose" style={{ borderColor: "var(--border-primary)" }}>
      {prev ? (
        <Link
          href={href(prev.slug)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all hover:shadow-sm group"
          style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)", color: "var(--text-secondary)" }}
        >
          <ChevronLeft size={16} className="shrink-0" style={{ color: "var(--text-tertiary)" }} />
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5" style={{ color: "var(--text-tertiary)" }}>Previous</div>
            <div className="font-semibold group-hover:underline" style={{ color: "var(--text-primary)" }}>{prev.title}</div>
          </div>
        </Link>
      ) : <div />}

      {next ? (
        <Link
          href={href(next.slug)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all hover:shadow-sm group ml-auto"
          style={{ borderColor: "var(--border-primary)", background: "var(--bg-card)", color: "var(--text-secondary)" }}
        >
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5" style={{ color: "var(--text-tertiary)" }}>Next</div>
            <div className="font-semibold group-hover:underline" style={{ color: "var(--text-primary)" }}>{next.title}</div>
          </div>
          <ChevronRight size={16} className="shrink-0" style={{ color: "var(--text-tertiary)" }} />
        </Link>
      ) : <div />}
    </div>
  );
}
