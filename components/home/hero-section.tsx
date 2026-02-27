"use client";

/**
 * Hero minimalista: video, input de búsqueda flotante (placeholder rotativo)
 * y modal de búsqueda; CTAs Comprar / Vender / Consignar.
 */
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Wallet, Car } from "lucide-react";
import {
  WHATSAPP_LINK_COMPRAR,
  WHATSAPP_LINK_VENDER,
  WHATSAPP_LINK_CONSIGNAR,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CatalogFilterMetadata } from "@/lib/catalog/types";
import { HeroSearchModal } from "@/components/home/hero-search-modal";

const PLACEHOLDERS = [
  "Buscar por palabra clave",
  "Buscar por modelo",
  "Buscar por marca",
] as const;

const ROTATE_MS = 3000;

const placeholderVariants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const ctaTransition = { type: "spring" as const, stiffness: 400, damping: 25 };

const CTA_CLASS =
  "inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-[var(--brand-orange)]/80 bg-[var(--brand-orange)]/15 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-orange)]/25 hover:border-[var(--brand-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 active:bg-[var(--brand-orange)]/30 sm:min-h-[44px] sm:px-5 sm:py-3 sm:text-base";

type HeroSectionProps = {
  filtersMeta: CatalogFilterMetadata;
};

export function HeroSection({ filtersMeta }: HeroSectionProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const rotatePlaceholder = useCallback(() => {
    setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
  }, []);

  useEffect(() => {
    const id = setInterval(rotatePlaceholder, ROTATE_MS);
    return () => clearInterval(id);
  }, [rotatePlaceholder]);

  const handleInputFocus = () => setSearchModalOpen(true);

  return (
    <section
      className="relative min-h-[50vh] w-full overflow-hidden sm:min-h-[60vh] md:min-h-[70vh]"
      aria-label="Hero"
    >
      {/* Video + overlay */}
      <div className="absolute inset-0">
        <video
          src="https://api.caradvice.com.ar/media/videos/hero_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover object-center"
          aria-label="Car Advice - Tu próximo destino comienza acá"
        />
        <div
          className="absolute inset-0 bg-[var(--brand-black)]/50"
          aria-hidden
        />
      </div>

      {/* Contenido: input flotante + CTAs */}
      <div className="relative flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 py-10 sm:min-h-[60vh] sm:gap-8 sm:py-12 md:min-h-[70vh] md:gap-10">
        {/* Input flotante: lupita + placeholder rotativo animado; click abre modal */}
        <div className="w-full max-w-xl">
          <label htmlFor="hero-search" className="sr-only">
            Buscar vehículos por palabra clave, modelo o marca
          </label>
          <div
            role="button"
            tabIndex={0}
            onClick={handleInputFocus}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleInputFocus();
              }
            }}
            className={cn(
              "relative flex min-h-[48px] w-full cursor-pointer items-center gap-3 rounded-xl border border-white/20 bg-black/30 pl-4 pr-4 py-3 backdrop-blur-sm touch-manipulation",
              "transition-colors focus:outline-none focus-visible:border-[var(--brand-orange)] focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
            )}
          >
            <Search
              className="size-5 shrink-0 text-white/70 sm:size-6"
              aria-hidden
            />
            <div className="min-h-[1.25rem] flex-1 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={placeholderIndex}
                  variants={placeholderVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="block text-left text-base text-white/60"
                  style={{ fontSize: "16px" }}
                >
                  {PLACEHOLDERS[placeholderIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <input
              id="hero-search"
              type="search"
              readOnly
              aria-label="Abrir búsqueda"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onFocus={handleInputFocus}
              tabIndex={-1}
            />
          </div>
        </div>

        {/* CTAs: Comprar, Vender, Consignar */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <motion.a
            href={WHATSAPP_LINK_COMPRAR}
            target="_blank"
            rel="noopener noreferrer"
            className={CTA_CLASS}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={ctaTransition}
          >
            <Search className="size-4 shrink-0 text-[var(--brand-orange)] sm:size-5" aria-hidden />
            Comprar
          </motion.a>
          <motion.a
            href={WHATSAPP_LINK_VENDER}
            target="_blank"
            rel="noopener noreferrer"
            className={CTA_CLASS}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={ctaTransition}
          >
            <Wallet className="size-4 shrink-0 text-[var(--brand-orange)] sm:size-5" aria-hidden />
            Vender
          </motion.a>
          <motion.a
            href={WHATSAPP_LINK_CONSIGNAR}
            target="_blank"
            rel="noopener noreferrer"
            className={CTA_CLASS}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={ctaTransition}
          >
            <Car className="size-4 shrink-0 text-[var(--brand-orange)] sm:size-5" aria-hidden />
            Consignar
          </motion.a>
        </div>
      </div>

      <HeroSearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        filtersMeta={filtersMeta}
      />
    </section>
  );
}
