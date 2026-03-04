"use client";

/**
 * Banner Vestri: ¿Sos revendedor? + venta mayorista para agencias.
 * CTA a vestri.caradvice.com.ar. Estilo Vestri (azul, fondo oscuro) alineado al home.
 */
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const VESTRI_URL = "https://vestri.caradvice.com.ar/";
const LOGO_SRC = "/logo-vestri.png";
const LOGO_ALT = "Vestri by Car Advice";

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

export function VestriBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={!!reduceMotion}
      className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[var(--brand-gray)]/40 bg-[var(--brand-offwhite)] px-4 py-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:px-6 sm:py-8 lg:grid lg:grid-cols-[1fr_auto] lg:gap-10 lg:px-8 lg:py-10"
    >
      {/* Columna izquierda: headline, subheadline, logo, CTA */}
      <div className="relative flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
        <motion.h2
          variants={itemVariants}
          custom={!!reduceMotion}
          className="text-2xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-3xl lg:text-[2rem]"
        >
          ¿Sos revendedor?
        </motion.h2>
        <motion.p
          variants={itemVariants}
          custom={!!reduceMotion}
          className="mt-2 text-base font-medium leading-snug text-[var(--brand-dark)] sm:text-lg"
        >
          Venta mayorista exclusiva para agencias de autos
        </motion.p>

        <motion.div
          variants={itemVariants}
          custom={!!reduceMotion}
          className="mt-5 flex w-full items-center justify-center gap-4 lg:justify-start"
        >
          <div className="relative h-12 w-auto sm:h-14">
            <Image
              src={LOGO_SRC}
              alt={LOGO_ALT}
              width={160}
              height={56}
              className="h-full w-auto object-contain object-center lg:object-left"
              sizes="(max-width: 640px) 120px, 160px"
              priority={false}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} custom={!!reduceMotion} className="mt-6 flex w-full justify-center lg:justify-start">
          <Link
            href={VESTRI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--vestri-blue)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[var(--vestri-blue-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vestri-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-offwhite)] sm:min-h-[48px] sm:px-6"
            aria-label="Ir a Vestri - venta mayorista para revendedores"
          >
            <span>Ir a Vestri</span>
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        </motion.div>
      </div>

      {/* Columna derecha: logo más grande (solo desktop) */}
      <motion.div
        variants={itemVariants}
        custom={!!reduceMotion}
        className="relative mt-6 flex items-center justify-center lg:mt-0 lg:w-[280px] lg:justify-end xl:w-[320px]"
      >
        <div className="relative h-24 w-full max-w-[200px] lg:h-28 lg:max-w-none xl:h-32">
          <Image
            src={LOGO_SRC}
            alt=""
            fill
            className="object-contain object-right"
            sizes="(min-width: 1024px) 280px, (min-width: 1280px) 320px, 200px"
            priority={false}
            aria-hidden
          />
        </div>
      </motion.div>
    </motion.article>
  );
}
