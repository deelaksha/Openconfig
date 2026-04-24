"use client";
import React from "react";
import { motion } from "framer-motion";
import PrePostXfmrSection from "@/components/guide/PrePostXfmrSection";
import PageNav from "@/components/guide/PageNav";

export default function PrePostTransformerPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <PrePostXfmrSection />
      <PageNav
        prev={{ title: "Subtree Transformer", slug: "subtree-transformer" }}
        next={{ title: "Decision Tree", slug: "decision-tree" }}
      />
    </motion.div>
  );
}
