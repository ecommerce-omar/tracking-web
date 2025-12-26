"use client"

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function FadeInWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
