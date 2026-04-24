"use client";
import React from "react";
import { motion } from "framer-motion";
import DirectMappingSection from "@/components/guide/DirectMappingSection";
import PageNav from "@/components/guide/PageNav";

export default function DirectMappingPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <DirectMappingSection />
      <PageNav
        prev={{ title: "Annotation Anatomy", slug: "annotation-anatomy" }}
        next={{ title: "Key Transformer", slug: "key-transformer" }}
      />
    </motion.div>
  );
}
