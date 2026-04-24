"use client";
import React from "react";
import { motion } from "framer-motion";
import KeyXfmrSection from "@/components/guide/KeyXfmrSection";
import PageNav from "@/components/guide/PageNav";

export default function KeyTransformerPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <KeyXfmrSection />
      <PageNav
        prev={{ title: "Direct Mapping", slug: "direct-mapping" }}
        next={{ title: "Field Transformer", slug: "field-transformer" }}
      />
    </motion.div>
  );
}
