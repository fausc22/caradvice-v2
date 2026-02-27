"use client";

/**
 * Modal de búsqueda del hero: sugerencias por marca (estilo Kavak/concesionarias),
 * búsqueda en vivo por marca/modelo, navegación al catálogo.
 * En mobile: pantalla completa, bloquea página (scroll + no cierre al tocar fuera).
 */
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buildCatalogUrl } from "@/lib/catalog";
import { normalizeCatalogString } from "@/lib/catalog/params";
import {
  CATALOG_DEFAULT_SORT,
  CATALOG_DEFAULT_PAGE,
  CATALOG_DEFAULT_PER_PAGE,
} from "@/lib/catalog/params";
import type { CatalogFilterMetadata } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const SUGGESTED_BRANDS_MAX = 8;

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;
const MAX_BRANDS = 5;
const MAX_MODELS = 10;

const baseParams = {
  sort: CATALOG_DEFAULT_SORT,
  page: CATALOG_DEFAULT_PAGE,
  perPage: CATALOG_DEFAULT_PER_PAGE,
};

function searchCatalogFilters(
  query: string,
  filtersMeta: CatalogFilterMetadata
): { brands: string[]; models: { marca: string; modelo: string }[] } {
  const q = normalizeCatalogString(query);
  if (!q) return { brands: [], models: [] };

  const brands = filtersMeta.brands.filter((b) =>
    normalizeCatalogString(b).includes(q)
  );
  const brandSet = new Set(brands.map((b) => normalizeCatalogString(b)));

  const models: { marca: string; modelo: string }[] = [];
  for (const [normBrand, modelList] of Object.entries(
    filtersMeta.modelsByBrand
  )) {
    const displayBrand =
      filtersMeta.brands.find(
        (b) => normalizeCatalogString(b) === normBrand
      ) ?? normBrand;
    const brandMatches = normBrand.includes(q);
    for (const model of modelList) {
      const modelMatches = normalizeCatalogString(model).includes(q);
      if (brandMatches || modelMatches) {
        models.push({ marca: displayBrand, modelo: model });
        if (models.length >= MAX_MODELS) break;
      }
    }
    if (models.length >= MAX_MODELS) break;
  }

  return {
    brands: brands.slice(0, MAX_BRANDS),
    models,
  };
}

type HeroSearchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filtersMeta: CatalogFilterMetadata;
};

export function HeroSearchModal({
  open,
  onOpenChange,
  filtersMeta,
}: HeroSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setDebouncedQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      return;
    }
    setIsSearching(true);
    const id = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setIsSearching(false);
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const results = useMemo(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH)
      return { brands: [], models: [] };
    return searchCatalogFilters(debouncedQuery, filtersMeta);
  }, [debouncedQuery, filtersMeta]);

  const hasResults =
    results.brands.length > 0 || results.models.length > 0;
  const showSuggestions =
    !debouncedQuery || debouncedQuery.length < MIN_QUERY_LENGTH;

  const goToCatalog = useCallback(
    (params: Parameters<typeof buildCatalogUrl>[0]) => {
      router.push(buildCatalogUrl(params));
      onOpenChange(false);
    },
    [router, onOpenChange]
  );

  const handleSelectMarca = (marca: string) => {
    goToCatalog({
      ...baseParams,
      marca,
    });
  };

  const handleSelectModelo = (marca: string, modelo: string) => {
    goToCatalog({
      ...baseParams,
      marca,
      modelo,
    });
  };

  const handleSearchByKeyword = () => {
    if (!query.trim()) return;
    goToCatalog({
      ...baseParams,
      q: query.trim(),
    });
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!open || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          if (isMobile) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isMobile) e.preventDefault();
        }}
        className={cn(
          "flex flex-col overflow-hidden p-0 duration-300",
          "fixed inset-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-[var(--brand-black)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2",
          "lg:inset-auto lg:left-1/2 lg:top-1/2 lg:h-auto lg:max-h-[85vh] lg:w-full lg:max-w-lg lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:border lg:border-white/10 lg:bg-[var(--brand-black)]/98 lg:p-0 lg:shadow-xl lg:data-[state=closed]:fade-out-0 lg:data-[state=closed]:zoom-out-95 lg:data-[state=open]:fade-in-0 lg:data-[state=open]:zoom-in-95"
        )}
      >
        <DialogTitle className="sr-only">
          Buscar vehículos por marca, modelo o palabra clave
        </DialogTitle>

        <div className="flex flex-col h-full max-h-[100dvh] lg:max-h-[85vh]">
          {/* Header: input + cerrar */}
          <header className="shrink-0 border-b border-white/10 px-4 py-3 lg:px-5 lg:py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex flex-1 items-center gap-3 rounded-xl border border-white/20 bg-white/5 pl-3 pr-3 py-2.5 transition-colors focus-within:border-[var(--brand-orange)]/60 focus-within:ring-1 focus-within:ring-[var(--brand-orange)]/30">
                <Search
                  className="size-5 shrink-0 text-white/60"
                  aria-hidden
                />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar marca, modelo o palabra clave"
                  autoComplete="off"
                  aria-label="Buscar vehículos"
                  aria-describedby="search-results-desc"
                  className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/50 outline-none"
                  style={{ fontSize: "16px" }}
                />
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="shrink-0 rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
                aria-label="Cerrar búsqueda"
              >
                <X className="size-5" />
              </button>
            </div>
          </header>

          {/* Contenido scrolleable */}
          <div
            id="search-results-desc"
            aria-live="polite"
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:px-5 lg:py-4 lg:pb-4 [overflow-scrolling:touch]"
          >
            {showSuggestions && filtersMeta.brands.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                  Explorar por marca
                </p>
                <ul className="space-y-0.5" role="list">
                  {filtersMeta.brands
                    .slice(0, SUGGESTED_BRANDS_MAX)
                    .map((marca) => (
                      <li key={marca}>
                        <button
                          type="button"
                          onClick={() => handleSelectMarca(marca)}
                          className={cn(
                            "flex min-h-[44px] w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/95 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-inset"
                          )}
                        >
                          {marca}
                        </button>
                      </li>
                    ))}
                </ul>
              </motion.div>
            )}

            {!showSuggestions && (
              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-8"
                  >
                    <div className="h-6 w-24 animate-pulse rounded bg-white/10" />
                  </motion.div>
                ) : hasResults ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {results.brands.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/60">
                          Marcas
                        </p>
                        <ul className="space-y-0.5" role="list">
                          {results.brands.map((marca) => (
                            <li key={marca}>
                              <button
                                type="button"
                                onClick={() => handleSelectMarca(marca)}
                                className={cn(
                                  "flex min-h-[44px] w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-inset"
                                )}
                              >
                                {marca}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {results.models.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/60">
                          Modelos
                        </p>
                        <ul className="space-y-0.5" role="list">
                          {results.models.map(({ marca, modelo }) => (
                            <li key={`${marca}-${modelo}`}>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelectModelo(marca, modelo)
                                }
                                className={cn(
                                  "flex min-h-[44px] w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-white/95 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-inset"
                                )}
                              >
                                <span className="font-medium">{marca}</span>
                                <span className="mx-1.5 text-white/50">•</span>
                                <span>{modelo}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 py-4"
                  >
                    <p className="text-sm text-white/70">
                      No encontramos resultados para &quot;{debouncedQuery}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={handleSearchByKeyword}
                      className={cn(
                        "w-full rounded-lg border border-[var(--brand-orange)]/50 bg-[var(--brand-orange)]/10 py-3 px-4 text-sm font-medium text-[var(--brand-orange)] transition-colors hover:bg-[var(--brand-orange)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
                      )}
                    >
                      Buscar en catálogo con &quot;{query.trim()}&quot;
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
