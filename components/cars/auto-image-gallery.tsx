"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type AutoImageGalleryProps = {
  images: string[];
  fallbackImage: string;
  alt: string;
  typeLabel: string;
  conditionLabel: string;
};

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
  const boundedIndex = Math.min(selectedIndex, Math.max(galleryImages.length - 1, 0));
  const activeImage = galleryImages[boundedIndex] ?? fallbackImage;
  const totalImages = galleryImages.length;

  return (
    <article className="overflow-hidden rounded-3xl border border-black/10 bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 64vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full border border-white/35 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
            {typeLabel}
          </span>
          <span className="inline-flex rounded-full border border-white/35 bg-[var(--brand-orange)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
            {conditionLabel}
          </span>
        </div>
        {totalImages > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex rounded-full border border-white/35 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {boundedIndex + 1} / {totalImages}
          </span>
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
                  "relative aspect-[4/3] overflow-hidden rounded-lg border transition-colors",
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
    </article>
  );
}
