"use client";

/**
 * Banner tipología: en mobile carousel (2 visibles, auto 5s + navegación);
 * en desktop una fila de 6.
 */
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCatalogUrl } from "@/lib/catalog";
import { CATALOG_TIPOLOGIA_LABELS } from "@/lib/catalog/types";
import type { CatalogTipologia } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const TIPOLOGIA_AUTO_ADVANCE_MS = 5000;
const MOBILE_SLIDES_PER_PAGE = 2;

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
      ease: [0.25, 0.1, 0.25, 1] as const,
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
    transition: { duration: reduce ? 0.06 : 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

function TipologiaCard({
  id,
  imagePath,
  reduceMotion,
  className,
}: {
  id: CatalogTipologia;
  imagePath: string;
  reduceMotion: boolean;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: reduceMotion ? 1 : 1.02 }}
      whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn("flex justify-center", className)}
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
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 180px, 20vw"
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
  );
}

const MOBILE_PAGE_COUNT = Math.ceil(
  TIPOLOGIA_ITEMS.length / MOBILE_SLIDES_PER_PAGE
);

export function TipologiaBanner() {
  const reduceMotion = useReducedMotion();
  const [currentPage, setCurrentPage] = useState(0);
  const autoAdvanceRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (page: number) => {
    setCurrentPage((page + MOBILE_PAGE_COUNT) % MOBILE_PAGE_COUNT);
  };

  useEffect(() => {
    autoAdvanceRef.current = setInterval(() => {
      setCurrentPage((p) => (p + 1) % MOBILE_PAGE_COUNT);
    }, TIPOLOGIA_AUTO_ADVANCE_MS);
    return () => {
      if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    };
  }, []);

  const resetAutoAdvance = () => {
    if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    autoAdvanceRef.current = setInterval(() => {
      setCurrentPage((p) => (p + 1) % MOBILE_PAGE_COUNT);
    }, TIPOLOGIA_AUTO_ADVANCE_MS);
  };

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

        {/* Mobile: carousel 2 visibles, auto 5s + flechas + dots */}
        <div className="relative lg:hidden">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              style={{ width: `${MOBILE_PAGE_COUNT * 100}%` }}
              animate={{
                x: `-${currentPage * (100 / MOBILE_PAGE_COUNT)}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {Array.from({ length: MOBILE_PAGE_COUNT }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="flex shrink-0 gap-2 pr-1"
                  style={{
                    width: `${100 / MOBILE_PAGE_COUNT}%`,
                    minWidth: `${100 / MOBILE_PAGE_COUNT}%`,
                  }}
                >
                  {TIPOLOGIA_ITEMS.slice(
                    pageIndex * MOBILE_SLIDES_PER_PAGE,
                    pageIndex * MOBILE_SLIDES_PER_PAGE + MOBILE_SLIDES_PER_PAGE
                  ).map(({ id, imagePath }) => (
                    <TipologiaCard
                      key={id}
                      id={id}
                      imagePath={imagePath}
                      reduceMotion={!!reduceMotion}
                      className="min-w-0 flex-1"
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          <button
            type="button"
            onClick={() => {
              goTo(currentPage - 1);
              resetAutoAdvance();
            }}
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-lg transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
            aria-label="Tipología anterior"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              goTo(currentPage + 1);
              resetAutoAdvance();
            }}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-lg transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
            aria-label="Tipología siguiente"
          >
            <ChevronRight className="size-5" />
          </button>

          <div
            className="mt-4 flex justify-center gap-1.5"
            role="tablist"
            aria-label="Páginas del carousel"
          >
            {Array.from({ length: MOBILE_PAGE_COUNT }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={currentPage === i}
                aria-label={`Ir a página ${i + 1}`}
                onClick={() => {
                  setCurrentPage(i);
                  resetAutoAdvance();
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-200",
                  currentPage === i
                    ? "w-6 bg-[var(--brand-orange)]"
                    : "w-2 bg-[var(--brand-dark)]/30 hover:bg-[var(--brand-dark)]/50"
                )}
              />
            ))}
          </div>
        </div>

        {/* Desktop: grid 6 columnas (una fila) — mismo layout original */}
        <div className="hidden lg:block">
          <div className="mx-auto grid max-w-none grid-cols-6 gap-4">
            {TIPOLOGIA_ITEMS.map(({ id, imagePath }) => (
              <motion.div
                key={id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <TipologiaCard
                  id={id}
                  imagePath={imagePath}
                  reduceMotion={!!reduceMotion}
                  className="w-full max-w-none"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
