"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  delay?: number;
}

export default function InfoCard({
  icon: Icon,
  title,
  description,
  color = "#3b82f6",
  delay = 0,
}: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative rounded-2xl border p-6 transition-all group cursor-default overflow-hidden"
      style={{
        borderColor: "var(--border-primary)",
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at top left, ${color}08, transparent 70%)`,
        }}
      />
      <div className="relative z-10">
        <div
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
          style={{
            background: `${color}15`,
            color: color,
          }}
        >
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}
