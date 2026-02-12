"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Filter, Search, SlidersHorizontal } from "lucide-react";
import {
  buildCatalogUrl,
  CATALOG_SORT_VALUES,
  CATALOG_TIPO_VALUES,
  type CatalogFilterMetadata,
  type CatalogListResponse,
  type CatalogQueryParams,
} from "@/lib/catalog";
import { toFeaturedCar } from "@/lib/mock-featured-cars";
import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
  "km-asc": "Kilometraje: menor a mayor",
};

function toQueryEntries(params: CatalogQueryParams): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  if (params.q) entries.push(["q", params.q]);
  if (params.tipo) entries.push(["tipo", params.tipo]);
  if (params.marca) entries.push(["marca", params.marca]);
  if (params.modelo) entries.push(["modelo", params.modelo]);
  if (params.anioMin !== undefined) entries.push(["anioMin", String(params.anioMin)]);
  if (params.anioMax !== undefined) entries.push(["anioMax", String(params.anioMax)]);
  if (params.precioMin !== undefined) entries.push(["precioMin", String(params.precioMin)]);
  if (params.precioMax !== undefined) entries.push(["precioMax", String(params.precioMax)]);
  if (params.kmMax !== undefined) entries.push(["kmMax", String(params.kmMax)]);
  if (params.transmision) entries.push(["transmision", params.transmision]);
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
        case "marca":
          next.marca = undefined;
          break;
        case "modelo":
          next.modelo = undefined;
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
        case "kmMax":
          next.kmMax = undefined;
          break;
        case "transmision":
          next.transmision = undefined;
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

  const chips: Array<{ key: string; label: string; href: string }> = [
    params.q
      ? {
          key: "q",
          label: `Búsqueda: ${params.q}`,
          href: buildCatalogUrl(removeKeys(["q"])),
        }
      : null,
    params.tipo
      ? {
          key: "tipo",
          label: `Tipo: ${params.tipo}`,
          href: buildCatalogUrl(removeKeys(["tipo"])),
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
    params.transmision
      ? {
          key: "transmision",
          label: `Transmisión: ${params.transmision}`,
          href: buildCatalogUrl(removeKeys(["transmision"])),
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
          label: `Precio: ${params.precioMin ?? "min"} - ${params.precioMax ?? "max"}`,
          href: buildCatalogUrl(removeKeys(["precioMin", "precioMax"])),
        }
      : null,
    params.kmMax !== undefined
      ? {
          key: "kmMax",
          label: `Km max: ${params.kmMax}`,
          href: buildCatalogUrl(removeKeys(["kmMax"])),
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
          className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-[var(--brand-black)] transition-colors hover:bg-muted sm:text-sm"
        >
          {chip.label}
          <span
            className="inline-flex size-4 items-center justify-center rounded-full border border-black/15 text-[10px]"
            aria-hidden
          >
            ×
          </span>
        </Link>
      ))}
      <Link
        href="/catalogo"
        className="inline-flex items-center rounded-full border border-black/15 px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/50 sm:text-sm"
      >
        Limpiar
      </Link>
    </div>
  );
}

function FiltersFormFields({
  params,
  filtersMeta,
}: {
  params: CatalogQueryParams;
  filtersMeta: CatalogFilterMetadata;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="tipo" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tipo
        </label>
        <select
          id="tipo"
          name="tipo"
          defaultValue={params.tipo ?? ""}
          className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
        >
          <option value="">Todos</option>
          {CATALOG_TIPO_VALUES.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="marca" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Marca
        </label>
        <select
          id="marca"
          name="marca"
          defaultValue={params.marca ?? ""}
          className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
        >
          <option value="">Todas</option>
          {filtersMeta.brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="modelo" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Modelo
        </label>
        <input
          id="modelo"
          name="modelo"
          defaultValue={params.modelo ?? ""}
          placeholder="Ej: Corolla"
          className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="anioMin"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Año min
          </label>
          <input
            id="anioMin"
            name="anioMin"
            type="number"
            inputMode="numeric"
            min={filtersMeta.yearRange.min}
            max={filtersMeta.yearRange.max}
            defaultValue={params.anioMin ?? ""}
            placeholder={String(filtersMeta.yearRange.min)}
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="anioMax"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Año max
          </label>
          <input
            id="anioMax"
            name="anioMax"
            type="number"
            inputMode="numeric"
            min={filtersMeta.yearRange.min}
            max={filtersMeta.yearRange.max}
            defaultValue={params.anioMax ?? ""}
            placeholder={String(filtersMeta.yearRange.max)}
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="precioMin"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Precio min
          </label>
          <input
            id="precioMin"
            name="precioMin"
            type="number"
            inputMode="numeric"
            min={filtersMeta.priceRange.min}
            max={filtersMeta.priceRange.max}
            defaultValue={params.precioMin ?? ""}
            placeholder={String(filtersMeta.priceRange.min)}
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="precioMax"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Precio max
          </label>
          <input
            id="precioMax"
            name="precioMax"
            type="number"
            inputMode="numeric"
            min={filtersMeta.priceRange.min}
            max={filtersMeta.priceRange.max}
            defaultValue={params.precioMax ?? ""}
            placeholder={String(filtersMeta.priceRange.max)}
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="kmMax" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Km max
        </label>
        <input
          id="kmMax"
          name="kmMax"
          type="number"
          inputMode="numeric"
          min={filtersMeta.kmRange.min}
          max={filtersMeta.kmRange.max}
          defaultValue={params.kmMax ?? ""}
          placeholder={String(filtersMeta.kmRange.max)}
          className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="transmision"
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Transmisión
        </label>
        <select
          id="transmision"
          name="transmision"
          defaultValue={params.transmision ?? ""}
          className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
        >
          <option value="">Todas</option>
          {filtersMeta.transmissions.map((transmission) => (
            <option key={transmission} value={transmission}>
              {transmission}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

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
    <div className="mt-8 rounded-2xl border border-black/10 bg-white p-3 sm:p-4">
      <div className="flex items-center justify-between sm:hidden">
        <PaginationNavLink
          href={prevHref}
          disabled={prevDisabled}
          className={cn(
            "inline-flex h-10 items-center gap-1 rounded-lg border px-3 text-sm font-semibold transition-colors",
            prevDisabled ? "" : "border-border text-[var(--brand-black)] hover:bg-muted/40",
          )}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Anterior
        </PaginationNavLink>
        <p className="text-xs font-medium text-muted-foreground">
          {currentPage} / {totalPages}
        </p>
        <PaginationNavLink
          href={nextHref}
          disabled={nextDisabled}
          className={cn(
            "inline-flex h-10 items-center gap-1 rounded-lg border px-3 text-sm font-semibold transition-colors",
            nextDisabled ? "" : "border-border text-[var(--brand-black)] hover:bg-muted/40",
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
            "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-colors",
            prevDisabled ? "" : "border-border text-[var(--brand-black)] hover:bg-muted/40",
          )}
        >
          Anterior
        </PaginationNavLink>
        <div className="flex items-center gap-1.5">
          {start > 1 && (
            <>
              <Link
                href={buildPageHref(params, 1)}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-sm font-semibold text-[var(--brand-black)] transition-colors hover:bg-muted/40"
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
                "inline-flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                pageNumber === currentPage
                  ? "border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white"
                  : "border-border text-[var(--brand-black)] hover:bg-muted/40",
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
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-sm font-semibold text-[var(--brand-black)] transition-colors hover:bg-muted/40"
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
            "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-colors",
            nextDisabled ? "" : "border-border text-[var(--brand-black)] hover:bg-muted/40",
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

export function CatalogPageShell({ result, params, filtersMeta }: CatalogPageShellProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const visibleFrom = result.total === 0 ? 0 : (result.appliedParams.page - 1) * result.perPage + 1;
  const visibleTo = result.total === 0 ? 0 : visibleFrom + result.items.length - 1;
  const returnTo = buildCatalogUrl(result.appliedParams, { includeDefaults: true });

  return (
    <main className="mx-auto min-h-screen w-full max-w-screen-xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 space-y-2 sm:mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-4xl">
          Catálogo
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Encontrá el vehículo ideal. {result.total} resultados disponibles.
        </p>
      </header>

      <section className="mb-5 rounded-2xl border border-black/10 bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:mb-6 sm:p-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <form action="/catalogo" className="flex flex-1 items-center gap-2">
            <HiddenFields params={params} omit={["q", "page"]} />
            <Input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Buscá por marca, modelo o versión"
              className="h-11 rounded-xl"
              aria-label="Buscar por marca, modelo o versión"
            />
            <Button type="submit" className="h-11 rounded-xl px-4">
              <Search className="size-4" />
              <span className="hidden sm:inline">Buscar</span>
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <form action="/catalogo" className="block">
              <HiddenFields params={params} omit={["sort", "page"]} />
              <select
                name="sort"
                defaultValue={params.sort}
                onChange={(event) => event.currentTarget.form?.requestSubmit()}
                className="h-11 min-w-[160px] rounded-xl border border-border bg-white px-3 text-sm font-medium text-[var(--brand-black)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] sm:min-w-[210px]"
                aria-label="Ordenar resultados"
              >
                {CATALOG_SORT_VALUES.map((sortValue) => (
                  <option key={sortValue} value={sortValue}>
                    {SORT_LABELS[sortValue]}
                  </option>
                ))}
              </select>
            </form>

            <Button
              type="button"
              variant="outline"
                className="h-11 rounded-xl px-4 lg:hidden"
              onClick={() => setIsFiltersOpen(true)}
            >
              <Filter className="size-4" />
              Filtros
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 h-screen max-h-screen w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 lg:hidden"
        >
          <DialogTitle className="sr-only">Filtros de catálogo</DialogTitle>

          <div className="flex h-full flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <p className="text-lg font-black uppercase tracking-tight text-[var(--brand-black)]">
                Filtros
              </p>
              <button
                type="button"
                onClick={() => setIsFiltersOpen(false)}
                className="inline-flex h-10 items-center rounded-lg border border-border px-3 text-sm font-semibold"
              >
                Cerrar
              </button>
            </div>

            <form action="/catalogo" className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  {result.total} resultados disponibles
                </p>
                <HiddenFields params={params} omit={["tipo", "marca", "modelo", "anioMin", "anioMax", "precioMin", "precioMax", "kmMax", "transmision", "page"]} />
                <FiltersFormFields params={params} filtersMeta={filtersMeta} />
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-border bg-background px-4 py-3">
                <Button asChild type="button" variant="outline" className="h-11 rounded-xl">
                  <Link href="/catalogo">Limpiar</Link>
                </Button>
                <Button type="submit" className="h-11 rounded-xl">
                  Ver resultados
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-[var(--brand-orange)]" />
              <h2 className="text-base font-black uppercase tracking-tight text-[var(--brand-black)]">
                Filtros
              </h2>
            </div>

            <form action="/catalogo" className="space-y-4">
              <HiddenFields params={params} omit={["tipo", "marca", "modelo", "anioMin", "anioMax", "precioMin", "precioMax", "kmMax", "transmision", "page"]} />
              <FiltersFormFields params={params} filtersMeta={filtersMeta} />

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button asChild type="button" variant="outline" className="rounded-xl">
                  <Link href="/catalogo">Limpiar</Link>
                </Button>
                <Button type="submit" className="rounded-xl">
                  Aplicar
                </Button>
              </div>
            </form>
          </div>
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-3">
            <p className="text-sm text-muted-foreground sm:text-base">
              Mostrando <span className="font-semibold text-[var(--brand-black)]">{visibleFrom}</span> -{" "}
              <span className="font-semibold text-[var(--brand-black)]">{visibleTo}</span> de{" "}
              <span className="font-semibold text-[var(--brand-black)]">{result.total}</span> vehículos
            </p>
            <p className="hidden text-sm text-muted-foreground md:block">
              Orden: {SORT_LABELS[result.appliedParams.sort]}
            </p>
          </div>

          <ActiveFiltersChips params={params} />

          {result.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center">
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
    </main>
  );
}
