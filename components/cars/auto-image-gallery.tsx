"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AutoImageGalleryProps = {
  images: string[];
  fallbackImage: string;
  alt: string;
  typeLabel: string;
  conditionLabel: string;
};

const arrowButtonClass =
  "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-95 sm:size-12";

export function AutoImageGallery({
  images,
  fallbackImage,
  alt,
  typeLabel,
  conditionLabel,
}: AutoImageGalleryProps) {
  const galleryImages = useMemo(() => {
    const normalized = images.filter(Boolean);
    if (normalized.length > 0) return normalized;
    return [fallbackImage];
  }, [images, fallbackImage]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const boundedIndex = Math.min(selectedIndex, Math.max(galleryImages.length - 1, 0));
  const activeImage = galleryImages[boundedIndex] ?? fallbackImage;
  const totalImages = galleryImages.length;

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i <= 0 ? totalImages - 1 : i - 1));
  }, [totalImages]);

  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i >= totalImages - 1 ? 0 : i + 1));
  }, [totalImages]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, goPrev, goNext]);

  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--brand-gray)]/40 bg-card p-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative flex h-full w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-inset"
          aria-label="Ampliar imagen"
        >
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
                alt={alt}
                fill
                className="object-cover object-center"
                priority={boundedIndex === 0}
                sizes="(max-width: 1024px) 100vw, 64vw"
              />
            </motion.div>
          </AnimatePresence>
          <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white sm:bottom-4 sm:right-4 sm:size-10">
            <Expand className="size-4 sm:size-5" aria-hidden />
          </span>
        </button>

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          {typeLabel.toLowerCase() === conditionLabel.toLowerCase() ? (
            <span className="inline-flex rounded-full border border-white/35 bg-[var(--brand-orange)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
              {conditionLabel}
            </span>
          ) : (
            <>
              <span className="inline-flex rounded-full border border-white/35 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                {typeLabel}
              </span>
              <span className="inline-flex rounded-full border border-white/35 bg-[var(--brand-orange)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                {conditionLabel}
              </span>
            </>
          )}
        </div>

        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className={cn(arrowButtonClass, "left-2 sm:left-3")}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="size-6 sm:size-7" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className={cn(arrowButtonClass, "right-2 sm:right-3")}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="size-6 sm:size-7" aria-hidden />
            </button>
            <span className="absolute bottom-3 left-3 inline-flex rounded-full border border-white/35 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur sm:bottom-4 sm:left-4">
              {boundedIndex + 1} / {totalImages}
            </span>
          </>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-3 grid grid-flow-col auto-cols-[72px] gap-2 overflow-x-auto pb-1 sm:auto-cols-[88px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {galleryImages.map((image, index) => {
            const isActive = boundedIndex === index;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-pressed={isActive}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg border transition-all duration-200",
                  isActive
                    ? "border-[var(--brand-orange)] ring-1 ring-[var(--brand-orange)]"
                    : "border-black/10 hover:border-[var(--brand-orange)]/50",
                )}
              >
                <Image
                  src={image}
                  alt={`${alt} - imagen ${index + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="88px"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox a pantalla completa */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Galería en pantalla completa"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cerrar"
          >
            <X className="size-6" aria-hidden />
          </button>

          <div
            className="flex flex-1 items-center justify-center p-4 pt-16 pb-20"
            onClick={() => setLightboxOpen(false)}
            role="presentation"
          >
            <div
              className="relative h-full w-full"
              onClick={(e) => e.stopPropagation()}
              role="presentation"
            >
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
                    alt={alt}
                    fill
                    className="object-contain object-center"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className={cn(arrowButtonClass, "left-2 sm:left-4")}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="size-6 sm:size-8" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className={cn(arrowButtonClass, "right-2 sm:right-4")}
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="size-6 sm:size-8" aria-hidden />
              </button>
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white">
                {boundedIndex + 1} / {totalImages}
              </p>
            </>
          )}
        </div>
      )}
    </article>
  );
}
