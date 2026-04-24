"use client";
import React from "react";
import { motion } from "framer-motion";
import AnnotationAnatomy from "@/components/guide/AnnotationAnatomy";
import PageNav from "@/components/guide/PageNav";

export default function AnnotationAnatomyPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <AnnotationAnatomy />
      <PageNav
        prev={{ title: "Overview", slug: "" }}
        next={{ title: "Direct Mapping", slug: "direct-mapping" }}
      />
    </motion.div>
  );
}
