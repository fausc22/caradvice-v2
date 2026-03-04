"use client";

import { motion, useReducedMotion } from "framer-motion";
import TrustindexWidget from "@/components/trustindex/TrustindexWidget";

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (reduce: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduce ? 0.1 : 0.35,
      ease: [0.25, 0.1, 0.25, 1] as const,
      staggerChildren: reduce ? 0 : 0.07,
      delayChildren: reduce ? 0 : 0.05,
    },
  }),
};

const itemVariants = {
  hidden: (reduce: boolean) => ({
    opacity: 0,
    y: reduce ? 0 : 10,
  }),
  visible: (reduce: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0.05 : 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export function ClientReviewsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-border bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="container mx-auto max-w-screen-xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={!!reduceMotion}
          className="relative overflow-hidden rounded-3xl border border-[var(--brand-gray)]/40 bg-[var(--brand-offwhite)] px-4 py-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:px-6 sm:py-8 lg:px-8 lg:py-10"
        >
          <div className="mb-6 flex flex-col items-center justify-center text-center sm:mb-8">
            <motion.h2
              variants={itemVariants}
              custom={!!reduceMotion}
              className="relative inline-block text-2xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-3xl lg:text-[2rem] after:absolute after:bottom-[-6px] after:left-1/2 after:h-0.5 after:w-12 after:-translate-x-1/2 after:rounded-full after:bg-[var(--brand-orange)]"
            >
              Nuestros clientes dicen
            </motion.h2>
          </div>

          <TrustindexWidget />
        </motion.div>
      </div>
    </section>
  );
}
