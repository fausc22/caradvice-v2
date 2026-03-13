"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (reduce: boolean) => ({
    opacity: 1,
    transition: {
      duration: reduce ? 0.08 : 0.35,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

export function AutoDetailPageMotion({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      custom={!!reduce}
    >
      {children}
    </motion.div>
  );
}

const sectionVariants = {
  hidden: (reduce: boolean) => ({
    opacity: 0,
    y: reduce ? 0 : 10,
  }),
  visible: (reduce: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduce ? 0.06 : 0.28,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

type AutoDetailSectionMotionProps = {
  children: ReactNode;
  className?: string;
};

export function AutoDetailSectionMotion({ children, className }: AutoDetailSectionMotionProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-24px" }}
      variants={sectionVariants}
      custom={!!reduce}
    >
      {children}
    </motion.div>
  );
}
