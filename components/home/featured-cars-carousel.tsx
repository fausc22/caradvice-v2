"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { featuredCars } from "@/lib/mock-featured-cars";
import { CarCard } from "@/components/cars/car-card";
import { CarCardSkeleton } from "@/components/cars/car-card-skeleton";
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
        <CarCardSkeleton key={index} className="h-full snap-start" />
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
          className="inline-flex items-center gap-0.5 rounded-full border border-[var(--brand-cream)]/50 bg-[var(--brand-offwhite)]/60 p-1 shadow-[0_2px_10px_rgba(0,0,0,0.04)] sm:gap-1 sm:p-1.5"
        >
          {HOME_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <motion.button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`carousel-panel-${category.id}`}
                id={`carousel-tab-${category.id}`}
                onClick={() => handleCategoryChange(category.id)}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "relative z-10 rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-tight transition-colors duration-200 sm:px-5 sm:py-2.5 sm:text-base",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-offwhite)]",
                  "rounded-full sm:min-h-[44px]",
                  isActive
                    ? "text-white"
                    : "text-[var(--brand-dark)] hover:bg-[var(--brand-orange)]/10 hover:text-[var(--brand-orange)] active:bg-[var(--brand-orange)]/15",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="carousel-tab-pill"
                    className="absolute inset-0 z-0 rounded-full bg-[var(--brand-orange)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    aria-hidden
                  />
                )}
                <span className="relative z-10">{category.label}</span>
              </motion.button>
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
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--brand-gray)]/40 bg-card/90 text-[var(--brand-black)] backdrop-blur transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Ver autos siguientes"
          onClick={goToNext}
          disabled={!canScrollRight}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--brand-gray)]/40 bg-card/90 text-[var(--brand-black)] backdrop-blur transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40"
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
        <AnimatePresence mode="wait" initial={false}>
          {isCategoryLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CarouselSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
