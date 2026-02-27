"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  buildCatalogUrl,
  CATALOG_SORT_VALUES,
  CATALOG_TIPOLOGIA_LABELS,
  type CatalogFilterMetadata,
  type CatalogListResponse,
  type CatalogQueryParams,
} from "@/lib/catalog";
import { toFeaturedCar } from "@/lib/mock-featured-cars";
import { CarCard } from "@/components/cars/car-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type CatalogPageShellProps = {
  result: CatalogListResponse;
  params: CatalogQueryParams;
  filtersMeta: CatalogFilterMetadata;
};

type ParamKey = keyof CatalogQueryParams;

const SORT_LABELS: Record<(typeof CATALOG_SORT_VALUES)[number], string> = {
  recomendados: "Recomendados",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  "anio-desc": "Año: más nuevos",
  "anio-asc": "Año: más antiguos",
  "km-asc": "Kilometraje: menor a mayor",
  "km-desc": "Kilometraje: mayor a menor",
};

function toQueryEntries(params: CatalogQueryParams): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  if (params.q) entries.push(["q", params.q]);
  if (params.tipo) entries.push(["tipo", params.tipo]);
  if (params.tipologia) entries.push(["tipologia", params.tipologia]);
  if (params.condicion) entries.push(["condicion", params.condicion]);
  if (params.marca) entries.push(["marca", params.marca]);
  if (params.modelo) entries.push(["modelo", params.modelo]);
  if (params.version) entries.push(["version", params.version]);
  if (params.moneda) entries.push(["moneda", params.moneda]);
  if (params.anioMin !== undefined) entries.push(["anioMin", String(params.anioMin)]);
  if (params.anioMax !== undefined) entries.push(["anioMax", String(params.anioMax)]);
  if (params.precioMin !== undefined) entries.push(["precioMin", String(params.precioMin)]);
  if (params.precioMax !== undefined) entries.push(["precioMax", String(params.precioMax)]);
  if (params.kmMin !== undefined) entries.push(["kmMin", String(params.kmMin)]);
  if (params.kmMax !== undefined) entries.push(["kmMax", String(params.kmMax)]);
  if (params.transmision) entries.push(["transmision", params.transmision]);
  if (params.combustible) entries.push(["combustible", params.combustible]);
  if (params.color) entries.push(["color", params.color]);
  if (params.puertas !== undefined) entries.push(["puertas", String(params.puertas)]);
  if (params.extras) entries.push(["extras", params.extras]);
  if (params.sort) entries.push(["sort", params.sort]);
  if (params.page) entries.push(["page", String(params.page)]);
  if (params.perPage) entries.push(["perPage", String(params.perPage)]);
  return entries;
}

function HiddenFields({
  params,
  omit = [],
}: {
  params: CatalogQueryParams;
  omit?: ParamKey[];
}) {
  const entries = useMemo(() => toQueryEntries(params), [params]);
  const omitSet = useMemo(() => new Set<string>(omit), [omit]);

  return (
    <>
      {entries
        .filter(([key]) => !omitSet.has(key))
        .map(([key, value]) => (
          <input key={`${key}-${value}`} type="hidden" name={key} value={value} />
        ))}
    </>
  );
}

function ActiveFiltersChips({ params }: { params: CatalogQueryParams }) {
  const removeKeys = (keys: ParamKey[]): CatalogQueryParams => {
    const next: CatalogQueryParams = { ...params, page: 1 };
    for (const key of keys) {
      switch (key) {
        case "q":
          next.q = undefined;
          break;
        case "tipo":
          next.tipo = undefined;
          break;
        case "tipologia":
          next.tipologia = undefined;
          break;
        case "condicion":
          next.condicion = undefined;
          break;
        case "marca":
          next.marca = undefined;
          break;
        case "modelo":
          next.modelo = undefined;
          break;
        case "version":
          next.version = undefined;
          break;
        case "moneda":
          next.moneda = undefined;
          break;
        case "anioMin":
          next.anioMin = undefined;
          break;
        case "anioMax":
          next.anioMax = undefined;
          break;
        case "precioMin":
          next.precioMin = undefined;
          break;
        case "precioMax":
          next.precioMax = undefined;
          break;
        case "kmMin":
          next.kmMin = undefined;
          break;
        case "kmMax":
          next.kmMax = undefined;
          break;
        case "transmision":
          next.transmision = undefined;
          break;
        case "combustible":
          next.combustible = undefined;
          break;
        case "color":
          next.color = undefined;
          break;
        case "puertas":
          next.puertas = undefined;
          break;
        case "extras":
          next.extras = undefined;
          break;
        case "sort":
          next.sort = "recomendados";
          break;
        case "page":
          next.page = 1;
          break;
        case "perPage":
          next.perPage = 12;
          break;
      }
    }
    return next;
  };

  const formatPrecio = (min?: number, max?: number) => {
    const fmt = (n: number) => n.toLocaleString("es-AR");
    if (params.moneda === "dolares") {
      return `${fmt(min ?? 0)} - ${fmt(max ?? 0)} USD`;
    }
    return `${min != null ? fmt(min) : "min"} - ${max != null ? fmt(max) : "max"} $`;
  };

  const chips: Array<{ key: string; label: string; href: string }> = [
    params.q
      ? { key: "q", label: `Búsqueda: ${params.q}`, href: buildCatalogUrl(removeKeys(["q"])) }
      : null,
    params.tipo
      ? { key: "tipo", label: `Tipo: ${params.tipo}`, href: buildCatalogUrl(removeKeys(["tipo"])) }
      : null,
    params.tipologia
      ? {
          key: "tipologia",
          label: `Tipología: ${CATALOG_TIPOLOGIA_LABELS[params.tipologia] ?? params.tipologia}`,
          href: buildCatalogUrl(removeKeys(["tipologia"])),
        }
      : null,
    params.condicion
      ? {
          key: "condicion",
          label: `Condición: ${params.condicion}`,
          href: buildCatalogUrl(removeKeys(["condicion"])),
        }
      : null,
    params.marca
      ? {
          key: "marca",
          label: `Marca: ${params.marca}`,
          href: buildCatalogUrl(removeKeys(["marca"])),
        }
      : null,
    params.modelo
      ? {
          key: "modelo",
          label: `Modelo: ${params.modelo}`,
          href: buildCatalogUrl(removeKeys(["modelo"])),
        }
      : null,
    params.version
      ? {
          key: "version",
          label: `Versión: ${params.version}`,
          href: buildCatalogUrl(removeKeys(["version"])),
        }
      : null,
    params.transmision
      ? {
          key: "transmision",
          label: `Transmisión: ${params.transmision}`,
          href: buildCatalogUrl(removeKeys(["transmision"])),
        }
      : null,
    params.combustible
      ? {
          key: "combustible",
          label: `Combustible: ${params.combustible}`,
          href: buildCatalogUrl(removeKeys(["combustible"])),
        }
      : null,
    params.anioMin !== undefined || params.anioMax !== undefined
      ? {
          key: "anio",
          label: `Año: ${params.anioMin ?? "min"} - ${params.anioMax ?? "max"}`,
          href: buildCatalogUrl(removeKeys(["anioMin", "anioMax"])),
        }
      : null,
    params.precioMin !== undefined || params.precioMax !== undefined
      ? {
          key: "precio",
          label: formatPrecio(params.precioMin, params.precioMax),
          href: buildCatalogUrl(removeKeys(["precioMin", "precioMax", "moneda"])),
        }
      : null,
    params.kmMin !== undefined || params.kmMax !== undefined
      ? {
          key: "km",
          label: `Km: ${(params.kmMin ?? 0).toLocaleString("es-AR")} - ${(params.kmMax ?? 300_000).toLocaleString("es-AR")}`,
          href: buildCatalogUrl(removeKeys(["kmMin", "kmMax"])),
        }
      : null,
    params.color
      ? {
          key: "color",
          label: `Color: ${params.color}`,
          href: buildCatalogUrl(removeKeys(["color"])),
        }
      : null,
    params.puertas !== undefined
      ? {
          key: "puertas",
          label: `${params.puertas} puertas`,
          href: buildCatalogUrl(removeKeys(["puertas"])),
        }
      : null,
    params.extras
      ? {
          key: "extras",
          label: `Extras: ${params.extras}`,
          href: buildCatalogUrl(removeKeys(["extras"])),
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; href: string }>;

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          aria-label={`Quitar filtro ${chip.label}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-orange)]/30 bg-muted/40 px-3 py-1 text-xs font-medium text-[var(--brand-black)] transition-all duration-300 ease-out hover:border-[var(--brand-orange)] hover:bg-[var(--brand-orange)]/5 sm:text-sm"
        >
          {chip.label}
          <span
            className="inline-flex size-4 items-center justify-center rounded-full border border-[var(--brand-orange)]/40 text-[10px] text-[var(--brand-orange)] transition-colors duration-200 hover:border-[var(--brand-orange)] hover:bg-[var(--brand-orange)]/10"
            aria-hidden
          >
            ×
          </span>
        </Link>
      ))}
      <Link
        href="/catalogo"
        className="inline-flex items-center rounded-full border border-black/15 px-3 py-1 text-xs font-semibold text-muted-foreground transition-all duration-300 ease-out hover:border-[var(--brand-orange)]/40 hover:bg-muted/50 hover:text-[var(--brand-orange)] sm:text-sm"
      >
        Limpiar
      </Link>
    </div>
  );
}

const FILTER_OMIT_KEYS: ParamKey[] = [
  "tipologia", "condicion", "marca", "modelo", "version", "moneda",
  "anioMin", "anioMax", "precioMin", "precioMax", "kmMin", "kmMax",
  "transmision", "combustible", "color", "puertas", "extras", "page",
];

function buildPageHref(params: CatalogQueryParams, page: number): string {
  return buildCatalogUrl({
    ...params,
    page,
  });
}

function PaginationNavLink({
  href,
  disabled,
  children,
  className,
}: {
  href: string;
  disabled: boolean;
  children: ReactNode;
  className: string;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled
        className={cn(
          "inline-flex cursor-not-allowed items-center justify-center border-border text-muted-foreground/60",
          className,
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function PaginationControls({ params, totalPages }: { params: CatalogQueryParams; totalPages: number }) {
  const prevDisabled = params.page <= 1;
  const nextDisabled = params.page >= totalPages;
  const currentPage = Math.min(Math.max(1, params.page), totalPages);
  const prevHref = buildPageHref(params, Math.max(1, currentPage - 1));
  const nextHref = buildPageHref(params, Math.min(totalPages, currentPage + 1));
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);

  return (
    <div className="mt-8 rounded-2xl border border-[var(--brand-gray)]/40 bg-card p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2 sm:hidden">
        <PaginationNavLink
          href={prevHref}
          disabled={prevDisabled}
          className={cn(
            "inline-flex h-10 min-h-[44px] touch-manipulation items-center gap-1 rounded-lg border px-3 text-sm font-semibold transition-all duration-300 ease-out",
            prevDisabled ? "" : "border-border text-[var(--brand-black)] hover:border-[var(--brand-orange)]/40 hover:bg-muted/40",
          )}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Anterior
        </PaginationNavLink>
        <p className="min-w-0 shrink-0 text-center text-xs font-medium text-muted-foreground">
          {currentPage} / {totalPages}
        </p>
        <PaginationNavLink
          href={nextHref}
          disabled={nextDisabled}
          className={cn(
            "inline-flex h-10 min-h-[44px] touch-manipulation items-center gap-1 rounded-lg border px-3 text-sm font-semibold transition-all duration-300 ease-out",
            nextDisabled ? "" : "border-border text-[var(--brand-black)] hover:border-[var(--brand-orange)]/40 hover:bg-muted/40",
          )}
        >
          Siguiente
          <ChevronRight className="size-4" aria-hidden />
        </PaginationNavLink>
      </div>

      <div className="hidden items-center justify-between sm:flex">
        <PaginationNavLink
          href={prevHref}
          disabled={prevDisabled}
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-all duration-300 ease-out",
            prevDisabled ? "" : "border-border text-[var(--brand-black)] hover:border-[var(--brand-orange)]/40 hover:bg-muted/40",
          )}
        >
          Anterior
        </PaginationNavLink>
        <div className="flex items-center gap-1.5">
          {start > 1 && (
            <>
              <Link
                href={buildPageHref(params, 1)}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-sm font-semibold text-[var(--brand-black)] transition-all duration-300 ease-out hover:border-[var(--brand-orange)]/40 hover:bg-muted/40"
              >
                1
              </Link>
              {start > 2 && <span className="px-1 text-sm text-muted-foreground">…</span>}
            </>
          )}
          {pages.map((pageNumber) => (
            <Link
              key={pageNumber}
              href={buildPageHref(params, pageNumber)}
              aria-current={pageNumber === currentPage ? "page" : undefined}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition-all duration-300 ease-out",
                pageNumber === currentPage
                  ? "border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white"
                  : "border-border text-[var(--brand-black)] hover:border-[var(--brand-orange)]/40 hover:bg-muted/40",
              )}
            >
              {pageNumber}
            </Link>
          ))}
          {end < totalPages && (
            <>
              {end < totalPages - 1 && (
                <span className="px-1 text-sm text-muted-foreground">…</span>
              )}
              <Link
                href={buildPageHref(params, totalPages)}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-sm font-semibold text-[var(--brand-black)] transition-all duration-300 ease-out hover:border-[var(--brand-orange)]/40 hover:bg-muted/40"
              >
                {totalPages}
              </Link>
            </>
          )}
        </div>
        <PaginationNavLink
          href={nextHref}
          disabled={nextDisabled}
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-all duration-300 ease-out",
            nextDisabled ? "" : "border-border text-[var(--brand-black)] hover:border-[var(--brand-orange)]/40 hover:bg-muted/40",
          )}
        >
          Siguiente
        </PaginationNavLink>
      </div>

      <p className="mt-2 hidden text-center text-xs text-muted-foreground sm:block">
        Página {currentPage} de {totalPages}
      </p>
    </div>
  );
}

function SortDropdown({
  params,
  className,
}: {
  params: CatalogQueryParams;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Ordenar resultados"
          className={cn(
            "inline-flex h-10 min-h-[44px] min-w-[170px] touch-manipulation items-center justify-between rounded-xl border border-border bg-card px-3 text-sm font-medium text-[var(--brand-black)] outline-none transition-all duration-300 ease-out hover:border-[var(--brand-orange)]/40 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] sm:min-w-[230px]",
            className,
          )}
        >
          <span className="truncate">{SORT_LABELS[params.sort]}</span>
          <ChevronDown
            className={cn(
              "ml-2 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[240px] rounded-xl border-[var(--brand-orange)]/15 p-1.5 transition-[transform,opacity] duration-300 ease-out"
      >
        <DropdownMenuRadioGroup
          value={params.sort}
          onValueChange={(value) => {
            const nextSort = value as CatalogQueryParams["sort"];
            if (nextSort === params.sort) return;
            router.push(
              buildCatalogUrl({
                ...params,
                sort: nextSort,
                page: 1,
              }),
            );
          }}
        >
          {CATALOG_SORT_VALUES.map((sortValue) => (
            <DropdownMenuRadioItem
              key={sortValue}
              value={sortValue}
              className="cursor-pointer rounded-lg py-2 text-sm font-medium transition-colors duration-200 focus:bg-[var(--brand-orange)]/10 focus:text-[var(--brand-orange)] data-[state=checked]:text-[var(--brand-orange)]"
            >
              {SORT_LABELS[sortValue]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CatalogPageShell({ result, params, filtersMeta }: CatalogPageShellProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showFloatingFilters, setShowFloatingFilters] = useState(false);
  const visibleFrom = result.total === 0 ? 0 : (result.appliedParams.page - 1) * result.perPage + 1;
  const visibleTo = result.total === 0 ? 0 : visibleFrom + result.items.length - 1;
  const returnTo = buildCatalogUrl(result.appliedParams, { includeDefaults: true });

  useEffect(() => {
    const onScroll = () => {
      setShowFloatingFilters(window.scrollY > 220);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden lg:pl-0 lg:pr-4">
      <section
        className="flex w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#c2410c] to-[#7c2d12] py-5 sm:gap-4 sm:py-6 md:flex-row md:gap-5 md:py-7"
        aria-label="Título del catálogo"
      >
        <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[3.5rem] md:w-[3.5rem]">
          <Image
            src="/04 Iso Negro.png"
            alt=""
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 3.5rem, 3.5rem"
            priority
          />
        </div>
        <h1 className="text-center text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl">
          Catálogo de Vehículos
        </h1>
      </section>

      <div className="px-4 py-4 sm:px-6 sm:py-6 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
      <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 h-screen max-h-screen w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 duration-500 ease-out data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 lg:hidden"
        >
          <DialogTitle className="sr-only">Filtros de catálogo</DialogTitle>

          <div className="flex h-full max-h-[100dvh] flex-col bg-background">
            <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <p className="text-lg font-black uppercase tracking-tight text-[var(--brand-black)]">
                Filtros
              </p>
              <button
                type="button"
                onClick={() => setIsFiltersOpen(false)}
                className="inline-flex h-10 items-center rounded-xl border border-border px-3 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--brand-orange)]/40"
                aria-label="Cerrar filtros"
              >
                Cerrar
              </button>
            </header>

            <form
              action="/catalogo"
              method="get"
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
              onSubmit={() => setIsFiltersOpen(false)}
            >
              <input type="hidden" name="page" value="1" />
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 [overflow-scrolling:touch]">
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  {result.total} resultados disponibles
                </p>
                <HiddenFields params={params} omit={FILTER_OMIT_KEYS} />
                <CatalogFilters
                  params={params}
                  filtersMeta={filtersMeta}
                  applyOnChange={false}
                  idPrefix="mobile"
                />
                <div className="h-6 shrink-0" aria-hidden />
              </div>
              <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-border bg-background px-4 py-3 pb-[env(safe-area-inset-bottom)]">
                <Button asChild type="button" variant="outline" className="h-12 rounded-xl">
                  <Link href="/catalogo">Limpiar</Link>
                </Button>
                <Button type="submit" className="h-12 rounded-xl">
                  Aplicar
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showFloatingFilters && !isFiltersOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: -16, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -16, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => setIsFiltersOpen(true)}
            className="fixed z-40 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--brand-gray)]/50 bg-card px-3 py-2 text-xs font-semibold text-[var(--brand-black)] shadow-[0_10px_24px_rgba(0,0,0,0.18)] lg:hidden bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))]"
            aria-label="Abrir filtros"
          >
            <ListFilter className="size-3.5" />
            Filtros
          </motion.button>
        )}
      </AnimatePresence>

      <div className="grid min-h-[calc(100vh-8rem)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-0">
        <aside className="hidden lg:block lg:shrink-0">
          <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-r-2xl border-y border-r border-l-2 border-l-[var(--brand-orange)]/30 border-[var(--brand-gray)]/40 bg-card py-4 pl-4 pr-3 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <div className="flex shrink-0 items-center gap-2 border-b border-border px-2 pb-3">
              <SlidersHorizontal className="size-4 text-[var(--brand-orange)]" />
              <h2 className="text-base font-black uppercase tracking-tight text-[var(--brand-black)]">
                Filtros
              </h2>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pt-3">
              <CatalogFilters
                params={params}
                filtersMeta={filtersMeta}
                applyOnChange={true}
              />
            </div>
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col lg:pl-8">
          <div className="mb-3 flex min-h-[44px] items-center justify-between gap-2 lg:hidden">
            <Button
              type="button"
              variant="outline"
              className="h-10 min-h-[44px] rounded-xl px-3 touch-manipulation"
              onClick={() => setIsFiltersOpen(true)}
            >
              <ListFilter className="size-4" />
              Filtros
            </Button>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
              <ArrowUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <SortDropdown params={params} className="min-w-[140px] max-w-[55vw] sm:min-w-[170px] sm:max-w-[58vw]" />
            </div>
          </div>

          <div className="mb-3 rounded-2xl border border-[var(--brand-gray)]/40 bg-card p-3 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:mb-4 sm:p-4">
            <form action="/catalogo" className="flex min-w-0 items-center gap-2">
              <HiddenFields params={params} omit={["q", "page"]} />
              <Input
                type="search"
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Buscar por palabra clave"
                className="h-10 min-h-[44px] flex-1 min-w-0 rounded-xl text-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] sm:h-11"
                aria-label="Buscar por palabra clave"
              />
              <Button type="submit" className="h-10 min-h-[44px] touch-manipulation rounded-xl px-3 sm:h-11 sm:px-4">
                <Search className="size-4" />
                <span className="hidden sm:inline">Buscar</span>
              </Button>
            </form>
          </div>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground sm:text-sm">
              Mostrando {visibleFrom}-{visibleTo} de {result.total} vehículos
            </p>

            <div className="hidden items-center gap-2 lg:flex">
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">Ordenar por</span>
              <SortDropdown params={params} className="min-w-[210px]" />
            </div>
          </div>

          <ActiveFiltersChips params={params} />

          {result.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--brand-gray)] bg-[var(--brand-cream)]/25 p-8 text-center">
              <p className="text-lg font-semibold text-[var(--brand-black)]">
                No encontramos resultados con estos filtros.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajustá rango de precio, año o borrá algunos filtros para ampliar la búsqueda.
              </p>
              <Button asChild className="mt-4 rounded-xl">
                <Link href="/catalogo">Limpiar filtros</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((car) => (
                  <CarCard
                    key={car.slug}
                    car={toFeaturedCar(car)}
                    className="h-full"
                    imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    detailHref={`/autos/${car.slug}?returnTo=${encodeURIComponent(returnTo)}`}
                  />
                ))}
              </div>
              <PaginationControls params={result.appliedParams} totalPages={result.totalPages} />
            </>
          )}
        </section>
      </div>
      </div>
    </main>
  );
}
