"use client";
import React from "react";
import { motion } from "framer-motion";
import CheatsheetSection from "@/components/guide/CheatsheetSection";
import PageNav from "@/components/guide/PageNav";

export default function CheatsheetPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <CheatsheetSection />
      <PageNav
        prev={{ title: "Verification", slug: "verification" }}
      />
    </motion.div>
  );
}
