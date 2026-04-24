"use client";
import React from "react";
import { motion } from "framer-motion";
import DecisionTree from "@/components/guide/DecisionTree";
import PageNav from "@/components/guide/PageNav";

export default function DecisionTreePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <DecisionTree />
      <PageNav
        prev={{ title: "Pre / Post Transformer", slug: "pre-post-transformer" }}
        next={{ title: "Verification", slug: "verification" }}
      />
    </motion.div>
  );
}
