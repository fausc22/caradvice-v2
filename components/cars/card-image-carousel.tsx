"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type CardImageCarouselProps = {
  images: string[];
  alt: string;
  imageSizes?: string;
  /** Overlay opcional (ej. sello "VENDIDO" en Fase 3). */
  overlay?: React.ReactNode;
};

const arrowButtonClass =
  "absolute top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-95 sm:size-9";

export function CardImageCarousel({
  images,
  alt,
  imageSizes = "(max-width: 640px) 90vw, (max-width: 1024px) 360px, 390px",
  overlay,
}: CardImageCarouselProps) {
  const galleryImages = useMemo(() => {
    const normalized = images.filter(Boolean);
    if (normalized.length > 0) return normalized;
    return [];
  }, [images]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const totalImages = galleryImages.length;
  const boundedIndex =
    totalImages > 0 ? Math.min(selectedIndex, totalImages - 1) : 0;
  const activeImage = galleryImages[boundedIndex];
  const hasMultiple = totalImages > 1;

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i <= 0 ? totalImages - 1 : i - 1));
  }, [totalImages]);

  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i >= totalImages - 1 ? 0 : i + 1));
  }, [totalImages]);

  const handleArrowClick = (e: React.MouseEvent, fn: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  if (galleryImages.length === 0) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[var(--brand-gray)]/20" />
    );
  }

  if (!hasMultiple) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={activeImage}
          alt={alt}
          fill
          sizes={imageSizes}
          quality={90}
          className="object-cover object-center"
        />
        {overlay}
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={boundedIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={activeImage}
            alt={`${alt} - imagen ${boundedIndex + 1} de ${totalImages}`}
            fill
            sizes={imageSizes}
            quality={90}
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {overlay}

      <button
        type="button"
        onClick={(e) => handleArrowClick(e, goPrev)}
        className={cn(arrowButtonClass, "left-2 sm:left-3")}
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="size-5 sm:size-6" aria-hidden />
      </button>
      <button
        type="button"
        onClick={(e) => handleArrowClick(e, goNext)}
        className={cn(arrowButtonClass, "right-2 sm:right-3")}
        aria-label="Imagen siguiente"
      >
        <ChevronRight className="size-5 sm:size-6" aria-hidden />
      </button>

      <span
        className="absolute bottom-2 left-2 inline-flex rounded-full border border-white/35 bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur sm:bottom-3 sm:left-3 sm:text-[11px]"
        aria-hidden
      >
        {boundedIndex + 1} / {totalImages}
      </span>
    </div>
  );
}
