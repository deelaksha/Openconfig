"use client";
import React from "react";
import { motion } from "framer-motion";
import SubtreeXfmrSection from "@/components/guide/SubtreeXfmrSection";
import PageNav from "@/components/guide/PageNav";

export default function SubtreeTransformerPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <SubtreeXfmrSection />
      <PageNav
        prev={{ title: "Table Transformer", slug: "table-transformer" }}
        next={{ title: "Pre / Post Transformer", slug: "pre-post-transformer" }}
      />
    </motion.div>
  );
}
