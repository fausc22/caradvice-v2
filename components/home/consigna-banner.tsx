"use client";

/**
 * Banner de Consignación: dos columnas (texto + imagen) en desktop,
 * un solo tipo con toggle en mobile. Fondo naranja marca, CTA WhatsApp.
 */
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK_CONSIGNAR } from "@/lib/constants";
import { cn } from "@/lib/utils";

const COPY = {
  title: "Consignacion",
  virtual: {
    label: "Virtual",
    body: "Nos compartis la info de tu auto y nosotros lo vendemos!",
  },
  fisica: {
    label: "Física",
    body: "Trae tu auto y nosotros te lo vendemos!",
  },
  cta: "Contactanos por Whatsapp!",
} as const;

const IMAGE_SRC = "/consigna.png";
const IMAGE_ALT = "Autos para consignación";

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

type MobileType = "virtual" | "fisica";

export function ConsignaBanner() {
  const [mobileType, setMobileType] = useState<MobileType>("virtual");
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={!!reduceMotion}
      className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[var(--brand-orange)] px-4 py-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:px-6 sm:py-8 lg:grid lg:grid-cols-[1fr_auto] lg:gap-8 lg:px-8 lg:py-10"
    >
      {/* Columna izquierda: título, tipos, CTA */}
      <div className="relative flex flex-col justify-center">
        <motion.h2
          variants={itemVariants}
          custom={!!reduceMotion}
          className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-[2rem]"
        >
          {COPY.title}
        </motion.h2>

        {/* Desktop: Física | Virtual con línea */}
        <div className="mt-5 hidden lg:block">
          <motion.div
            variants={itemVariants}
            custom={!!reduceMotion}
            className="flex gap-6"
          >
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-cream)]/90">
                {COPY.virtual.label}
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-white/95 sm:text-base">
                {COPY.virtual.body}
              </p>
            </div>
            <div
              className="w-px shrink-0 bg-[var(--brand-cream)]/40"
              aria-hidden
            />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-cream)]/90">
                {COPY.fisica.label}
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-white/95 sm:text-base">
                {COPY.fisica.body}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mobile: toggle Virtual | Física y un solo tipo */}
        <div className="mt-5 lg:hidden">
          <motion.div
            variants={itemVariants}
            custom={!!reduceMotion}
            className="space-y-4"
          >
            <div
              role="tablist"
              aria-label="Tipo de consignación"
              className="inline-flex rounded-full border border-[var(--brand-cream)]/30 bg-black/10 p-0.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mobileType === "virtual"}
                onClick={() => setMobileType("virtual")}
                className={cn(
                  "rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-tight transition-colors sm:text-sm",
                  mobileType === "virtual"
                    ? "bg-white text-[var(--brand-orange)]"
                    : "text-white/90 hover:text-white"
                )}
              >
                {COPY.virtual.label}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobileType === "fisica"}
                onClick={() => setMobileType("fisica")}
                className={cn(
                  "rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-tight transition-colors sm:text-sm",
                  mobileType === "fisica"
                    ? "bg-white text-[var(--brand-orange)]"
                    : "text-white/90 hover:text-white"
                )}
              >
                {COPY.fisica.label}
              </button>
            </div>
            <motion.div
              key={mobileType}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="min-h-[3rem]"
            >
              <p className="text-sm font-medium leading-snug text-white/95 sm:text-base">
                {mobileType === "virtual" ? COPY.virtual.body : COPY.fisica.body}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA WhatsApp */}
        <motion.div variants={itemVariants} custom={!!reduceMotion} className="mt-6">
          <motion.div
            whileHover={{ scale: reduceMotion ? 1 : 1.02 }}
            whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
            transition={{ duration: 0.15 }}
            className="inline-block"
          >
            <Link
              href={WHATSAPP_LINK_CONSIGNAR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 overflow-hidden rounded-xl border border-[var(--brand-cream)]/40 bg-[var(--brand-offwhite)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-black)] transition-colors hover:border-[var(--brand-cream)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-orange)] sm:min-h-[48px] sm:px-5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white">
                <MessageCircle className="size-5" aria-hidden />
              </span>
              <span>{COPY.cta}</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Columna derecha: imagen (solo desktop) */}
      <motion.div
        variants={itemVariants}
        custom={!!reduceMotion}
        className="relative mt-6 hidden lg:block lg:mt-0 lg:w-[320px] xl:w-[380px]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg bg-black/5">
          <Image
            src={IMAGE_SRC}
            alt={IMAGE_ALT}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 320px, (min-width: 1280px) 380px"
            priority={false}
          />
        </div>
      </motion.div>
    </motion.article>
  );
}
