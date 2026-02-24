"use client";

/**
 * Banner tipología: una fila en desktop, minimal, fondo con degradado.
 */
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buildCatalogUrl } from "@/lib/catalog";
import { CATALOG_TIPOLOGIA_LABELS } from "@/lib/catalog/types";
import type { CatalogTipologia } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const TIPOLOGIA_ITEMS: Array<{
  id: CatalogTipologia;
  imagePath: string;
}> = [
  { id: "sedan", imagePath: "/tipologia/Sedan.png" },
  { id: "hatchback", imagePath: "/tipologia/Hatchback.png" },
  { id: "suv", imagePath: "/tipologia/SUV.png" },
  { id: "pickup", imagePath: "/tipologia/Pick up.png" },
  { id: "van", imagePath: "/tipologia/Utilitario.png" },
  { id: "motos", imagePath: "/tipologia/motos.png" },
];

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (reduce: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduce ? 0.12 : 0.3,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: reduce ? 0 : 0.04,
      delayChildren: reduce ? 0 : 0.04,
    },
  }),
};

const itemVariants = {
  hidden: (reduce: boolean) => ({
    opacity: 0,
    y: reduce ? 0 : 6,
  }),
  visible: (reduce: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0.06 : 0.22, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export function TipologiaBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      custom={!!reduceMotion}
      className={cn(
        "relative overflow-x-hidden border-t border-[var(--brand-cream)]/20",
        "bg-gradient-to-b from-[var(--brand-offwhite)] via-[var(--brand-offwhite)] to-[var(--brand-cream)]/30"
      )}
      aria-labelledby="tipologia-banner-title"
    >
      <div className="container mx-auto max-w-screen-xl px-4 py-7 sm:px-6 sm:py-9">
        {/* Título minimal: más liviano, línea sutil */}
        <motion.header
          variants={itemVariants}
          custom={!!reduceMotion}
          className="mb-5 sm:mb-6"
        >
          <h2
            id="tipologia-banner-title"
            className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-dark)]/90 sm:text-base"
          >
            Buscá por tipología
          </h2>
          <div
            className="mx-auto mt-2 h-px w-8 bg-[var(--brand-orange)]/50"
            aria-hidden
          />
        </motion.header>

        {/* Grid: 2 cols móvil, 3 tablet, 6 en desktop (una fila) */}
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:max-w-none lg:grid-cols-6 lg:gap-4">
          {TIPOLOGIA_ITEMS.map(({ id, imagePath }) => (
            <motion.div
              key={id}
              variants={itemVariants}
              custom={!!reduceMotion}
              className="flex justify-center"
            >
              <motion.div
                whileHover={{ scale: reduceMotion ? 1 : 1.02 }}
                whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="w-full max-w-[160px] sm:max-w-[180px] lg:max-w-none"
              >
                <Link
                  href={buildCatalogUrl({
                    tipologia: id,
                    sort: "recomendados",
                    page: 1,
                    perPage: 12,
                  })}
                  className={cn(
                    "group relative flex aspect-[4/3] w-full overflow-hidden rounded-lg border border-[var(--brand-orange)]/25 transition-all duration-300",
                    "hover:border-[var(--brand-orange)]/70 hover:shadow-[0_2px_12px_rgba(255,90,46,0.12)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-offwhite)]"
                  )}
                  aria-label={`Ver ${CATALOG_TIPOLOGIA_LABELS[id]} en el catálogo`}
                >
                  <Image
                    src={imagePath}
                    alt=""
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 20vw"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5">
                    <span
                      className={cn(
                        "block text-[10px] font-medium uppercase tracking-wider text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-all duration-300 sm:text-xs",
                        "group-hover:text-[var(--brand-orange)] group-hover:tracking-[0.15em]"
                      )}
                    >
                      {CATALOG_TIPOLOGIA_LABELS[id]}
                    </span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
