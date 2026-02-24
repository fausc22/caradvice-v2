"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Car,
  ChevronDown,
  LayoutGrid,
  Truck,
  CarFront,
  Sun,
  Users,
  Bus,
  Bike,
  MoreHorizontal,
} from "lucide-react";
import {
  buildCatalogUrl,
  CATALOG_CONDICION_VALUES,
  CATALOG_TIPOLOGIA_LABELS,
  CATALOG_TIPOLOGIA_VALUES,
  normalizeCatalogString,
  type CatalogFilterMetadata,
  type CatalogQueryParams,
} from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { DualRangeFilter } from "@/components/catalog/dual-range-filter";
import { FilterSelect } from "@/components/catalog/filter-select";
import { cn } from "@/lib/utils";

const TIPOLOGIA_ICONS: Record<(typeof CATALOG_TIPOLOGIA_VALUES)[number], React.ReactNode> = {
  sedan: <Car className="size-4" />,
  hatchback: <Car className="size-4" />,
  coupe: <Car className="size-4" />,
  convertible: <Sun className="size-4" />,
  suv: <CarFront className="size-4" />,
  pickup: <Truck className="size-4" />,
  familiar: <Users className="size-4" />,
  van: <Bus className="size-4" />,
  motos: <Bike className="size-4" />,
};

const CONDICION_LABELS: Record<(typeof CATALOG_CONDICION_VALUES)[number], string> = {
  "0km": "0 km",
  usados: "Usados",
  reventa: "Para Reventa",
  proximo_ingreso: "Próximo Ingreso",
};

const FIELD_STYLE =
  "h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none transition-all duration-300 ease-out placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]";

const LABEL_STYLE =
  "text-xs font-semibold uppercase tracking-wide text-[var(--brand-black)]/70";

const COLOR_HEX: Record<string, string> = {
  Blanco: "#ffffff",
  Negro: "#1a1a1a",
  Gris: "#6b7280",
  Plata: "#9ca3af",
  Rojo: "#dc2626",
  Azul: "#2563eb",
  Verde: "#16a34a",
  Beige: "#d4b896",
  Marrón: "#78350f",
};

const PUERTAS_OPTIONS = [
  { value: "3", label: "3 puertas" },
  { value: "5", label: "5 puertas" },
] as const;

type CatalogFiltersProps = {
  params: CatalogQueryParams;
  filtersMeta: CatalogFilterMetadata;
  /** Desktop: apply on change (navigate). Mobile: no, use form submit. */
  applyOnChange?: boolean;
  /** For mobile modal: pass name/id to avoid duplicates */
  idPrefix?: string;
};

export function CatalogFilters({
  params,
  filtersMeta,
  applyOnChange = false,
  idPrefix = "",
}: CatalogFiltersProps) {
  const router = useRouter();
  const id = (s: string) => (idPrefix ? `${idPrefix}-${s}` : s);

  const [formValues, setFormValues] = useState(params);
  useEffect(() => {
    setFormValues(params);
  }, [params]);

  const v = (k: keyof CatalogQueryParams) => {
    const x = applyOnChange ? params[k] : formValues[k];
    return x === undefined || x === null ? "" : String(x);
  };
  const setV = (k: keyof CatalogQueryParams, val: string) => {
    const parsed = k === "puertas" && val ? Number(val) : val || undefined;
    if (applyOnChange) nav({ [k]: parsed } as Partial<CatalogQueryParams>);
    else setFormValues((prev) => ({ ...prev, [k]: parsed } as CatalogQueryParams));
  };

  const nav = (next: Partial<CatalogQueryParams>) => {
    if (!applyOnChange) return;
    const url = buildCatalogUrl({ ...params, ...next, page: 1 });
    // Diferir navegación para que el dropdown de Radix cierre sin provocar recarga en desktop
    queueMicrotask(() => {
      router.push(url, { scroll: false });
    });
  };

  const formatPrice = (n: number) => n.toLocaleString("es-AR");

  const currentMarca = applyOnChange ? params.marca : formValues.marca;
  const currentModelo = applyOnChange ? params.modelo : formValues.modelo;
  const keyMarca = normalizeCatalogString(currentMarca);
  const keyModelo = normalizeCatalogString(currentModelo);
  const modelos = currentMarca ? filtersMeta.modelsByBrand[keyMarca] ?? [] : [];
  const versiones =
    currentMarca && currentModelo
      ? filtersMeta.versionesByModelo[`${keyMarca}|${keyModelo}`] ?? []
      : [];

  return (
    <div className="space-y-5">
      {/* 1. Tipología grid 3×3 */}
      <div className="space-y-2">
        <label className={LABEL_STYLE}>Tipología</label>
        <div className="grid grid-cols-3 gap-2">
          {applyOnChange ? (
            CATALOG_TIPOLOGIA_VALUES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => nav({ tipologia: params.tipologia === t ? undefined : t })}
                className={cn(
                  "flex min-h-[44px] touch-manipulation flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[11px] font-medium transition-all duration-300 ease-out sm:text-xs",
                  params.tipologia === t
                    ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/10 text-[var(--brand-orange)]"
                    : "border-border bg-card text-muted-foreground hover:border-[var(--brand-orange)]/40 hover:bg-muted/30",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out sm:size-9",
                    params.tipologia === t
                      ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/5 text-[var(--brand-orange)]"
                      : "border-[var(--brand-orange)]/30 text-muted-foreground",
                  )}
                >
                  {TIPOLOGIA_ICONS[t]}
                </span>
                <span className="w-full truncate text-center">{CATALOG_TIPOLOGIA_LABELS[t]}</span>
              </button>
            ))
          ) : (
            <>
              <label
                className={cn(
                  "col-span-3 flex min-h-[44px] touch-manipulation cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[11px] font-medium transition-all duration-300 ease-out sm:col-span-1 sm:col-start-1 sm:text-xs",
                  !params.tipologia
                    ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/10 text-[var(--brand-orange)]"
                    : "border-border bg-card text-muted-foreground hover:border-[var(--brand-orange)]/40 hover:bg-muted/30",
                )}
              >
                <input
                  type="radio"
                  name="tipologia"
                  value=""
                  defaultChecked={!params.tipologia}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out sm:size-9",
                    !params.tipologia
                      ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/5 text-[var(--brand-orange)]"
                      : "border-[var(--brand-orange)]/30 text-muted-foreground",
                  )}
                >
                  <LayoutGrid className="size-4" />
                </span>
                <span className="w-full truncate text-center">Todos</span>
              </label>
              {CATALOG_TIPOLOGIA_VALUES.map((t) => (
                <label
                  key={t}
                  className={cn(
                    "flex min-h-[44px] touch-manipulation cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[11px] font-medium transition-all duration-300 ease-out sm:text-xs",
                    params.tipologia === t
                      ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/10 text-[var(--brand-orange)]"
                      : "border-border bg-card text-muted-foreground hover:border-[var(--brand-orange)]/40 hover:bg-muted/30",
                  )}
                >
                  <input
                    type="radio"
                    name="tipologia"
                    value={t}
                    defaultChecked={params.tipologia === t}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out sm:size-9",
                      params.tipologia === t
                        ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/5 text-[var(--brand-orange)]"
                        : "border-[var(--brand-orange)]/30 text-muted-foreground",
                    )}
                  >
                    {TIPOLOGIA_ICONS[t]}
                  </span>
                  <span className="w-full truncate text-center">{CATALOG_TIPOLOGIA_LABELS[t]}</span>
                </label>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 2. Condición */}
      <div className="space-y-2">
        <label htmlFor={id("condicion")} className={LABEL_STYLE}>
          Condición
        </label>
        <FilterSelect
          id={id("condicion")}
          name="condicion"
          value={v("condicion")}
          onValueChange={(val) => setV("condicion", val)}
          options={CATALOG_CONDICION_VALUES.map((c) => ({ value: c, label: CONDICION_LABELS[c] }))}
          placeholder="Todas"
          inModal={!!idPrefix}
        />
      </div>

      {/* 3. Marca / Modelo / Versión */}
      <div className="space-y-2">
        <label htmlFor={id("marca")} className={LABEL_STYLE}>
          Marca
        </label>
        <FilterSelect
          id={id("marca")}
          name="marca"
          value={v("marca")}
          onValueChange={(val) => {
            if (applyOnChange) {
              nav({
                marca: val || undefined,
                modelo: undefined,
                version: undefined,
              });
              return;
            }
            setV("marca", val);
            setV("modelo", "");
            setV("version", "");
          }}
          options={filtersMeta.brands.map((b) => ({ value: b, label: b }))}
          placeholder="Todas"
          inModal={!!idPrefix}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={id("modelo")} className={LABEL_STYLE}>
          Modelo
        </label>
        <FilterSelect
          id={id("modelo")}
          name="modelo"
          value={v("modelo")}
          onValueChange={(val) => {
            if (applyOnChange) {
              nav({
                modelo: val || undefined,
                version: undefined,
              });
              return;
            }
            setV("modelo", val);
            setV("version", "");
          }}
          options={modelos.map((m) => ({ value: m, label: m }))}
          placeholder="Todos"
          disabled={!currentMarca}
          inModal={!!idPrefix}
        />
      </div>

      {currentMarca && currentModelo && (
        <div className="space-y-2">
          <label htmlFor={id("version")} className={LABEL_STYLE}>
            Versión
          </label>
          <FilterSelect
            id={id("version")}
            name="version"
            value={v("version")}
            onValueChange={(val) => setV("version", val)}
            options={versiones.map((ver) => ({ value: ver, label: ver }))}
            placeholder="Todas"
            inModal={!!idPrefix}
          />
        </div>
      )}

      {/* 4. Precio: moneda + slider + inputs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className={LABEL_STYLE}>Precio</span>
          <div className="flex shrink-0 rounded-lg border border-border bg-[var(--brand-orange)]/5 p-0.5">
            {applyOnChange ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    nav({
                      moneda: undefined,
                      precioMin: undefined,
                      precioMax: undefined,
                    })
                  }
                  className={cn(
                    "rounded-md px-2 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
                    params.moneda !== "dolares"
                      ? "bg-card text-[var(--brand-orange)] shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-[var(--brand-orange)]/80",
                  )}
                >
                  $
                </button>
                <button
                  type="button"
                  onClick={() =>
                    nav({
                      moneda: "dolares",
                      precioMin: undefined,
                      precioMax: undefined,
                    })
                  }
                  className={cn(
                    "rounded-md px-2 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
                    params.moneda === "dolares"
                      ? "bg-card text-[var(--brand-orange)] shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-[var(--brand-orange)]/80",
                  )}
                >
                  USD
                </button>
              </>
            ) : (
              <>
                <label
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
                    params.moneda !== "dolares"
                      ? "bg-card text-[var(--brand-orange)] shadow-sm font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  <input
                    type="radio"
                    name="moneda"
                    value="pesos"
                    defaultChecked={params.moneda !== "dolares"}
                    className="sr-only"
                  />
                  $
                </label>
                <label
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
                    params.moneda === "dolares"
                      ? "bg-card text-[var(--brand-orange)] shadow-sm font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  <input
                    type="radio"
                    name="moneda"
                    value="dolares"
                    defaultChecked={params.moneda === "dolares"}
                    className="sr-only"
                  />
                  USD
                </label>
              </>
            )}
          </div>
        </div>
        <DualRangeFilter
          label=""
          min={params.moneda === "dolares" ? filtersMeta.priceRangeUsd.min : filtersMeta.priceRange.min}
          max={
            params.moneda === "dolares"
              ? (filtersMeta.priceRangeUsd.max > 0 ? filtersMeta.priceRangeUsd.max : 200_000)
              : (filtersMeta.priceRange.max > 0 ? filtersMeta.priceRange.max : 100_000_000)
          }
          valueMin={params.precioMin}
          valueMax={params.precioMax}
          step={params.moneda === "dolares" ? 100 : 100_000}
          formatDisplay={formatPrice}
          onValueChange={(a, b) => nav({ precioMin: a, precioMax: b })}
          applyOnChange={applyOnChange}
          nameMin="precioMin"
          nameMax="precioMax"
          idPrefix={id("precio")}
        />
      </div>

      {/* 5. Kilometraje */}
      <DualRangeFilter
        label="Kilometraje (km)"
        min={0}
        max={300_000}
        valueMin={params.kmMin}
        valueMax={params.kmMax}
        step={1000}
        formatDisplay={(n) => n.toLocaleString("es-AR")}
        onValueChange={(a, b) => nav({ kmMin: a, kmMax: b })}
        applyOnChange={applyOnChange}
        nameMin="kmMin"
        nameMax="kmMax"
        idPrefix={id("km")}
      />

      {/* 6. Año */}
      <DualRangeFilter
        label="Año"
        min={filtersMeta.yearRange.min}
        max={filtersMeta.yearRange.max}
        valueMin={params.anioMin}
        valueMax={params.anioMax}
        step={1}
        formatDisplay={(n) => String(n)}
        onValueChange={(a, b) => nav({ anioMin: a, anioMax: b })}
        applyOnChange={applyOnChange}
        nameMin="anioMin"
        nameMax="anioMax"
        idPrefix={id("anio")}
      />

      {/* 7. Transmisión y Combustible */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label htmlFor={id("transmision")} className={LABEL_STYLE}>
            Transmisión
          </label>
          <FilterSelect
            id={id("transmision")}
            name="transmision"
            value={v("transmision")}
            onValueChange={(val) => setV("transmision", val)}
            options={filtersMeta.transmissions.map((t) => ({ value: t, label: t }))}
            placeholder="Todas"
            inModal={!!idPrefix}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={id("combustible")} className={LABEL_STYLE}>
            Combustible
          </label>
          <FilterSelect
            id={id("combustible")}
            name="combustible"
            value={v("combustible")}
            onValueChange={(val) => setV("combustible", val)}
            options={filtersMeta.combustibles.map((c) => ({ value: c, label: c }))}
            placeholder="Todos"
            inModal={!!idPrefix}
          />
        </div>
      </div>

      {/* 8. Otros (expandible) */}
      <details className="group rounded-xl border border-border bg-card transition-all duration-300 ease-out hover:border-[var(--brand-orange)]/40">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--brand-black)] transition-colors duration-300 hover:bg-[var(--brand-orange)]/5 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <MoreHorizontal className="size-4 text-[var(--brand-orange)]" />
            Otros
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-open:rotate-180" />
        </summary>
        <div className="space-y-4 border-t border-border px-3 py-3">
          {/* Color: paleta */}
          <div className="space-y-2">
            <label className={LABEL_STYLE}>Color</label>
            <input type="hidden" name="color" value={v("color")} />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setV("color", "")}
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  !v("color")
                    ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/10 ring-2 ring-[var(--brand-orange)]/30"
                    : "border-border bg-muted/50 hover:border-[var(--brand-orange)]/50",
                )}
                title="Todos los colores"
                aria-pressed={!v("color")}
              >
                <span className="text-[10px] font-semibold text-muted-foreground">Todos</span>
              </button>
              {filtersMeta.colores.map((colorName) => {
                const hex = COLOR_HEX[colorName] ?? "#94a3b8";
                const selected = v("color") === colorName;
                return (
                  <button
                    key={colorName}
                    type="button"
                    onClick={() =>
                      setV("color", selected ? "" : colorName)
                    }
                    className={cn(
                      "size-9 shrink-0 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]",
                      selected
                        ? "border-[var(--brand-orange)] ring-2 ring-[var(--brand-orange)]/30"
                        : "border-border hover:border-[var(--brand-orange)]/50",
                    )}
                    style={{ backgroundColor: hex }}
                    title={colorName}
                    aria-pressed={selected}
                  />
                );
              })}
            </div>
          </div>

          {/* Puertas: select 3 o 5 */}
          <div className="space-y-2">
            <label htmlFor={id("puertas")} className={LABEL_STYLE}>
              Puertas
            </label>
            <FilterSelect
              id={id("puertas")}
              name="puertas"
              value={v("puertas")}
              onValueChange={(val) => setV("puertas", val)}
              options={[...PUERTAS_OPTIONS]}
              placeholder="Cualquiera"
              inModal={!!idPrefix}
            />
          </div>

          {/* Extras: checkboxes acumulables */}
          {filtersMeta.extras.length > 0 && (
            <div className="space-y-2">
              <label className={LABEL_STYLE}>Extras</label>
              <input
                type="hidden"
                name="extras"
                value={v("extras")}
              />
              <ul className="flex flex-col gap-2">
                {filtersMeta.extras.map((extra) => {
                  const selectedExtras = (v("extras") || "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const checked = selectedExtras.some(
                    (e) => e.toLowerCase() === extra.toLowerCase(),
                  );
                  return (
                    <li key={extra}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg py-1.5 pr-2 transition-colors hover:bg-[var(--brand-orange)]/5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? selectedExtras.filter(
                                  (e) => e.toLowerCase() !== extra.toLowerCase(),
                                )
                              : [...selectedExtras, extra];
                            setV("extras", next.join(","));
                          }}
                          className="size-4 rounded border-border text-[var(--brand-orange)] focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
                        />
                        <span className="text-sm font-medium text-[var(--brand-black)]">
                          {extra}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
