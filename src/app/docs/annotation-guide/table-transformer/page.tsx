"use client";
import React from "react";
import { motion } from "framer-motion";
import TableXfmrSection from "@/components/guide/TableXfmrSection";
import PageNav from "@/components/guide/PageNav";

export default function TableTransformerPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <TableXfmrSection />
      <PageNav
        prev={{ title: "Field Transformer", slug: "field-transformer" }}
        next={{ title: "Subtree Transformer", slug: "subtree-transformer" }}
      />
    </motion.div>
  );
}
