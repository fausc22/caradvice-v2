"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarCard } from "@/components/cars/car-card";
import type { FeaturedCar } from "@/lib/mock-featured-cars";

type SimilarCarsCarouselProps = {
  cars: FeaturedCar[];
  returnTo: string;
};

const AUTOPLAY_MS = 5000;

export function SimilarCarsCarousel({ cars, returnTo }: SimilarCarsCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);

  const updateScrollState = (target: HTMLDivElement | null) => {
    if (!target) return;
    const maxScrollLeft = target.scrollWidth - target.clientWidth;
    setCanScrollLeft(target.scrollLeft > 8);
    setCanScrollRight(target.scrollLeft < maxScrollLeft - 8);
  };

  const getScrollStep = (target: HTMLDivElement) => {
    const firstCard = target.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(target).columnGap || "0");
    if (!firstCard) return target.clientWidth * 0.5;
    return firstCard.offsetWidth + gap;
  };

  const goToPrev = () => {
    const container = containerRef.current;
    if (!container) return;
    setIsAutoPlayEnabled(false);
    isProgrammaticScrollRef.current = true;
    container.scrollBy({ left: -getScrollStep(container), behavior: "smooth" });
    window.setTimeout(() => { isProgrammaticScrollRef.current = false; }, 450);
  };

  const goToNext = () => {
    const container = containerRef.current;
    if (!container) return;
    setIsAutoPlayEnabled(false);
    isProgrammaticScrollRef.current = true;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScrollLeft - 8) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: getScrollStep(container), behavior: "smooth" });
    }
    window.setTimeout(() => { isProgrammaticScrollRef.current = false; }, 450);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    updateScrollState(container);
    const handleResize = () => updateScrollState(containerRef.current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    updateScrollState(container);
  }, [cars.length]);

  useEffect(() => {
    if (cars.length <= 1 || !isAutoPlayEnabled) return;
    const timer = window.setInterval(() => {
      const container = containerRef.current;
      if (!container) return;
      isProgrammaticScrollRef.current = true;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScrollLeft - 8) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: getScrollStep(container), behavior: "smooth" });
      }
      window.setTimeout(() => { isProgrammaticScrollRef.current = false; }, 450);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [cars.length, isAutoPlayEnabled]);

  if (cars.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--brand-dark)]/70">
        No hay otros vehículos de la misma tipología por ahora.
      </p>
    );
  }

  return (
    <div className="relative min-w-0">
      <div className="mb-4 flex w-full flex-nowrap items-center justify-end gap-2 sm:mb-5 sm:gap-3">
        <div className="flex shrink-0 gap-1 sm:gap-1.5">
          <button
            type="button"
            aria-label="Ver vehículos anteriores"
            onClick={goToPrev}
            disabled={!canScrollLeft}
            className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-full border border-[var(--brand-gray)]/40 bg-card/90 text-[var(--brand-black)] backdrop-blur transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-[44px] sm:min-w-[44px]"
          >
            <ChevronLeft className="size-4 sm:size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Ver vehículos siguientes"
            onClick={goToNext}
            disabled={!canScrollRight || cars.length === 0}
            className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-full border border-[var(--brand-gray)]/40 bg-card/90 text-[var(--brand-black)] backdrop-blur transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-[44px] sm:min-w-[44px]"
          >
            <ChevronRight className="size-4 sm:size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={(e) => {
          updateScrollState(e.currentTarget);
          if (!isProgrammaticScrollRef.current) setIsAutoPlayEnabled(false);
        }}
        onWheel={() => setIsAutoPlayEnabled(false)}
        onTouchStart={() => setIsAutoPlayEnabled(false)}
        className="grid grid-flow-col auto-cols-[100%] gap-4 overflow-x-auto pb-2 pr-1 snap-x snap-mandatory sm:auto-cols-[calc((100%_-_1rem)_/_2)] md:auto-cols-[calc((100%_-_2rem)_/_3)] xl:auto-cols-[calc((100%_-_3rem)_/_4)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cars.map((car) => (
          <CarCard
            key={car.slug}
            car={car}
            className="h-full snap-start"
            imageSizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
            detailHref={`/autos/${car.slug}?returnTo=${encodeURIComponent(returnTo)}`}
          />
        ))}
      </div>
    </div>
  );
}
