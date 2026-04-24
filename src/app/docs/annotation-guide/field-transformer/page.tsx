"use client";
import React from "react";
import { motion } from "framer-motion";
import FieldXfmrSection from "@/components/guide/FieldXfmrSection";
import PageNav from "@/components/guide/PageNav";

export default function FieldTransformerPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <FieldXfmrSection />
      <PageNav
        prev={{ title: "Key Transformer", slug: "key-transformer" }}
        next={{ title: "Table Transformer", slug: "table-transformer" }}
      />
    </motion.div>
  );
}
