"use client";
import React from "react";
import { motion } from "framer-motion";
import VerificationSection from "@/components/guide/VerificationSection";
import PageNav from "@/components/guide/PageNav";

export default function VerificationPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <VerificationSection />
      <PageNav
        prev={{ title: "Decision Tree", slug: "decision-tree" }}
        next={{ title: "Cheatsheet", slug: "cheatsheet" }}
      />
    </motion.div>
  );
}
