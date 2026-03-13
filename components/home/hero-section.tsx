"use client";

/**
 * Hero minimalista: imagen fija, input de búsqueda flotante (placeholder rotativo)
 * y modal de búsqueda; CTAs Comprar / Vender / Consignar.
 */
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { WHATSAPP_LINK_COMPRAR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CatalogFilterMetadata } from "@/lib/catalog/types";
import { HeroSearchModal } from "@/components/home/hero-search-modal";
import { TasacionModal } from "@/components/home/tasacion-modal";
import { ConsignacionModal } from "@/components/home/consignacion-modal";

export type HeroSectionProps = {
  filtersMeta: CatalogFilterMetadata;
  /** Si se pasan, el modal de consignación se controla desde el padre (ej. para abrirlo desde el banner). */
  consignacionModalOpen?: boolean;
  onConsignacionModalOpenChange?: (open: boolean) => void;
};

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

const CTA_CLASS =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/85 bg-white/90 px-3 py-2.5 text-sm font-medium leading-none text-[var(--brand-black)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/70";

const CTA_HOVER = {
  backgroundColor: "var(--brand-orange)",
  color: "#ffffff",
  borderColor: "var(--brand-orange)",
};

const CTA_TAP = {
  backgroundColor: "var(--brand-orange-light)",
  color: "#ffffff",
  borderColor: "var(--brand-orange)",
};

const CTA_TRANSITION = {
  type: "tween" as const,
  duration: 0.18,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

export function HeroSection({
  filtersMeta,
  consignacionModalOpen: controlledConsignacionOpen,
  onConsignacionModalOpenChange,
}: HeroSectionProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [tasacionModalOpen, setTasacionModalOpen] = useState(false);
  const [internalConsignacionOpen, setInternalConsignacionOpen] = useState(false);

  const consignacionModalOpen =
    controlledConsignacionOpen ?? internalConsignacionOpen;
  const setConsignacionModalOpen =
    onConsignacionModalOpenChange ?? setInternalConsignacionOpen;

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
      {/* Imagen de fondo + overlay */}
      <div className="absolute inset-0">
        <Image
          src="/WhatsApp Image 2026-03-09 at 15.24.30.jpeg"
          alt="Car Advice - Tu próximo destino comienza acá"
          fill
          priority
          className="object-cover object-center md:object-bottom"
        />
        <div
          className="absolute inset-0 bg-[var(--brand-black)]/50"
          aria-hidden
        />
      </div>

      {/* Contenido: claim + branding + input flotante + CTAs */}
      <div className="relative flex min-h-[50vh] flex-col items-center justify-center px-4 py-10 sm:min-h-[60vh] sm:py-12 md:min-h-[70vh]">
        {/* Bloque de acción principal: claim, logo, buscador + CTAs */}
        <div className="w-full max-w-xl space-y-4 text-center">
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-white/80 sm:text-base md:text-lg">
              Tu auto en buenas manos
            </p>
            <div className="flex justify-center">
              <div className="relative h-9 w-28 sm:h-10 sm:w-32 md:h-12 md:w-40">
                <Image
                  src="/04 Iso Negro.png"
                  alt="CAR ADVICE"
                  fill
                  className="object-contain invert"
                  sizes="128px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Bloque de interacción: buscador + CTAs cercanos y consistentes */}
          <div className="space-y-2.5">
          {/* Input flotante: lupita + placeholder rotativo animado; click abre modal */}
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

          {/* CTAs: mismo componente base, jerarquía visual primary/secondary */}
          <div className="grid grid-cols-3 gap-2">
            <motion.a
              href={WHATSAPP_LINK_COMPRAR}
              target="_blank"
              rel="noopener noreferrer"
              className={CTA_CLASS}
              whileHover={CTA_HOVER}
              whileTap={CTA_TAP}
              transition={CTA_TRANSITION}
            >
              Comprar
            </motion.a>
            <motion.button
              type="button"
              onClick={() => setTasacionModalOpen(true)}
              className={CTA_CLASS}
              whileHover={CTA_HOVER}
              whileTap={CTA_TAP}
              transition={CTA_TRANSITION}
            >
              Vender
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setConsignacionModalOpen(true)}
              className={CTA_CLASS}
              whileHover={CTA_HOVER}
              whileTap={CTA_TAP}
              transition={CTA_TRANSITION}
            >
              Consignar
            </motion.button>
          </div>
          </div>
        </div>
      </div>

      <HeroSearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        filtersMeta={filtersMeta}
      />
      <TasacionModal
        open={tasacionModalOpen}
        onOpenChange={setTasacionModalOpen}
        filtersMeta={filtersMeta}
      />
      <ConsignacionModal
        open={consignacionModalOpen}
        onOpenChange={setConsignacionModalOpen}
        filtersMeta={filtersMeta}
      />
    </section>
  );
}
