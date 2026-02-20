"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { featuredCars } from "@/lib/mock-featured-cars";
import { CarCard } from "@/components/cars/car-card";
import { cn } from "@/lib/utils";

type HomeCategory = "ofertas" | "destacados" | "oportunidades";

const HOME_CATEGORIES: Array<{ id: HomeCategory; label: string }> = [
  { id: "ofertas", label: "Ofertas" },
  { id: "destacados", label: "Destacados" },
  { id: "oportunidades", label: "Oportunidades" },
];

const TAB_RELOAD_MS = 550;

function CarouselSkeleton() {
  return (
    <div className="grid grid-flow-col auto-cols-[88%] gap-4 overflow-hidden sm:auto-cols-[calc((100%_-_1rem)_/_2)] md:auto-cols-[calc((100%_-_2rem)_/_3)] xl:auto-cols-[calc((100%_-_3rem)_/_4)]">
      {Array.from({ length: 4 }).map((_, index) => (
        <article
          key={index}
          className="h-full overflow-hidden rounded-3xl border border-[var(--brand-gray)]/40 bg-card shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="aspect-[16/10] w-full animate-pulse bg-muted/50" />
          <div className="space-y-4 p-4 sm:p-5">
            <div className="space-y-2">
              <div className="h-5 w-2/3 animate-pulse rounded bg-muted/60" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted/50" />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="h-7 animate-pulse rounded-full bg-muted/50" />
              <div className="h-7 animate-pulse rounded-full bg-muted/50" />
              <div className="h-7 animate-pulse rounded-full bg-muted/50" />
            </div>
            <div className="h-12 w-2/3 animate-pulse rounded bg-muted/60" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 animate-pulse rounded-xl bg-muted/60" />
              <div className="h-10 w-12 animate-pulse rounded-xl bg-muted/50" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function FeaturedCarsCarousel() {
  const [activeCategory, setActiveCategory] = useState<HomeCategory>("ofertas");
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const cars = featuredCars;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const tabReloadTimeoutRef = useRef<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);

  const updateScrollState = (target: HTMLDivElement | null) => {
    if (!target) {
      return;
    }

    const maxScrollLeft = target.scrollWidth - target.clientWidth;
    setCanScrollLeft(target.scrollLeft > 8);
    setCanScrollRight(target.scrollLeft < maxScrollLeft - 8);
  };

  const getScrollStep = (target: HTMLDivElement) => {
    const firstCard = target.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(target).columnGap || "0");
    if (!firstCard) {
      return target.clientWidth * 0.5;
    }

    return firstCard.offsetWidth + gap;
  };

  const goToPrev = () => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    setIsAutoPlayEnabled(false);
    isProgrammaticScrollRef.current = true;
    container.scrollBy({ left: -getScrollStep(container), behavior: "smooth" });
    window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 450);
  };

  const goToNext = () => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    setIsAutoPlayEnabled(false);
    isProgrammaticScrollRef.current = true;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScrollLeft - 8) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: getScrollStep(container), behavior: "smooth" });
    }
    window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 450);
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
    return () => {
      if (tabReloadTimeoutRef.current) {
        window.clearTimeout(tabReloadTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (cars.length <= 1 || !isAutoPlayEnabled || isCategoryLoading) return;
    const timer = window.setInterval(() => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      isProgrammaticScrollRef.current = true;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScrollLeft - 8) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: getScrollStep(container), behavior: "smooth" });
      }

      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 450);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [cars.length, isAutoPlayEnabled, isCategoryLoading]);

  const handleCategoryChange = (category: HomeCategory) => {
    if (category === activeCategory || isCategoryLoading) {
      return;
    }

    setActiveCategory(category);
    setIsCategoryLoading(true);

    const container = containerRef.current;
    if (container) {
      isProgrammaticScrollRef.current = true;
      container.scrollTo({ left: 0, behavior: "smooth" });
      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 300);
    }

    if (tabReloadTimeoutRef.current) {
      window.clearTimeout(tabReloadTimeoutRef.current);
    }

    tabReloadTimeoutRef.current = window.setTimeout(() => {
      setIsCategoryLoading(false);
    }, TAB_RELOAD_MS);
  };

  return (
    <div className="relative">
      <div className="mb-5 flex justify-center">
        <div
          role="tablist"
          aria-label="Categorías destacadas"
          className="inline-flex items-center gap-1 rounded-full border border-[var(--brand-gray)]/40 bg-card p-1 shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
        >
          {HOME_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`carousel-panel-${category.id}`}
                id={`carousel-tab-${category.id}`}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-tight transition-all sm:px-5 sm:text-base",
                  isActive
                    ? "bg-[var(--brand-black)] text-white"
                    : "text-[var(--brand-black)] hover:bg-muted/60",
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3 flex justify-end gap-1.5">
        <button
          type="button"
          aria-label="Ver autos anteriores"
          onClick={goToPrev}
          disabled={!canScrollLeft}
          className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--brand-gray)]/40 bg-card/90 text-[var(--brand-black)] backdrop-blur transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Ver autos siguientes"
          onClick={goToNext}
          disabled={!canScrollRight}
          className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--brand-gray)]/40 bg-card/90 text-[var(--brand-black)] backdrop-blur transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <div
        role="tabpanel"
        id={`carousel-panel-${activeCategory}`}
        aria-labelledby={`carousel-tab-${activeCategory}`}
        className="overflow-hidden"
      >
        {isCategoryLoading ? (
          <CarouselSkeleton />
        ) : (
          <div
            ref={containerRef}
            onScroll={(event) => {
              updateScrollState(event.currentTarget);
              if (!isProgrammaticScrollRef.current) {
                setIsAutoPlayEnabled(false);
              }
            }}
            onWheel={() => setIsAutoPlayEnabled(false)}
            onTouchStart={() => setIsAutoPlayEnabled(false)}
            className="grid grid-flow-col auto-cols-[88%] gap-4 overflow-x-auto pb-2 pr-1 snap-x snap-mandatory sm:auto-cols-[calc((100%_-_1rem)_/_2)] md:auto-cols-[calc((100%_-_2rem)_/_3)] xl:auto-cols-[calc((100%_-_3rem)_/_4)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cars.map((car) => (
              <CarCard
                key={car.slug}
                car={car}
                className="h-full snap-start"
                imageSizes="(max-width: 639px) 88vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
              />
            ))}
          </div>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
        {HOME_CATEGORIES.find((item) => item.id === activeCategory)?.label}
      </p>
    </div>
  );
}
