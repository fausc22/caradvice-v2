"use client";

/**
 * Bloque de filtros del hero. Arma la URL de /catalogo con query params.
 * Marcas, modelos y años se rellenan desde filtersMeta (datos estáticos del catálogo).
 */
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const MotionLink = motion(Link);
import { Button } from "@/components/ui/button";
import { HeroSelect } from "@/components/home/hero-select";
import { buildCatalogUrl, normalizeCatalogString, type CatalogTipo } from "@/lib/catalog";
import type { CatalogFilterMetadata } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const TAB_SPRING = { type: "spring" as const, stiffness: 380, damping: 30 };

const TIPO_OPTIONS = [
  { value: "usados" as const, label: "Usados" },
  { value: "nuevos" as const, label: "Nuevos" },
  { value: "motos" as const, label: "Motos" },
] as const;

const PLACEHOLDER_MARCA = "Elegí la marca";
const PLACEHOLDER_MODELO = "Elegí el modelo";
const PLACEHOLDER_ANIO = "Elegí el año";

export function HeroFilters({ filtersMeta }: { filtersMeta: CatalogFilterMetadata }) {
  const marcasOptions = useMemo(
    () => [PLACEHOLDER_MARCA, ...filtersMeta.brands],
    [filtersMeta.brands]
  );
  const anosOptions = useMemo(() => {
    const { min, max } = filtersMeta.yearRange;
    const years: string[] = [PLACEHOLDER_ANIO];
    for (let y = max; y >= min; y--) years.push(String(y));
    return years;
  }, [filtersMeta.yearRange]);

  const [selectedTipo, setSelectedTipo] = useState<CatalogTipo>("usados");
  const [marca, setMarca] = useState(PLACEHOLDER_MARCA);
  const [modelo, setModelo] = useState(PLACEHOLDER_MODELO);
  const [anio, setAnio] = useState(PLACEHOLDER_ANIO);
  const [keyword, setKeyword] = useState("");

  const modelosOptions = useMemo(() => {
    if (!marca || marca === PLACEHOLDER_MARCA) return [PLACEHOLDER_MODELO];
    const key = normalizeCatalogString(marca);
    const models = filtersMeta.modelsByBrand[key] ?? [];
    return [PLACEHOLDER_MODELO, ...models];
  }, [marca, filtersMeta.modelsByBrand]);

  const parsedYear = Number.parseInt(anio, 10);
  const hasYear = Number.isFinite(parsedYear) && anio !== PLACEHOLDER_ANIO;

  const searchHref = buildCatalogUrl({
    q: keyword.trim() || undefined,
    tipo: selectedTipo,
    marca: marca !== PLACEHOLDER_MARCA ? marca : undefined,
    modelo: modelo !== PLACEHOLDER_MODELO ? modelo : undefined,
    anioMin: hasYear ? parsedYear : undefined,
    anioMax: hasYear ? parsedYear : undefined,
    sort: "recomendados",
    page: 1,
    perPage: 12,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="hero-filters-container w-full max-w-2xl rounded-2xl border border-[var(--brand-cream)]/20 bg-[var(--brand-black)]/50 px-4 py-5 backdrop-blur-md sm:px-6 sm:py-6"
    >
      {/* Tipo: Usados / Nuevos / Motos — underline naranja animado al cambiar */}
      <div className="flex items-center justify-center gap-6 sm:gap-8">
        {TIPO_OPTIONS.map(({ value, label }) => {
          const isSelected = selectedTipo === value;
          return (
            <motion.button
              key={value}
              type="button"
              onClick={() => setSelectedTipo(value)}
              whileTap={{ scale: 0.97 }}
              transition={TAB_SPRING}
              className={cn(
                "relative pb-1.5 text-sm font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                isSelected
                  ? "text-white"
                  : "text-[var(--brand-cream)]/90 hover:text-white"
              )}
              aria-pressed={isSelected}
              aria-label={`Filtrar por ${label}`}
            >
              {label}
              {isSelected && (
                <motion.span
                  layoutId="hero-tipo-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--brand-orange)]"
                  transition={TAB_SPRING}
                  aria-hidden
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Marca, Modelo, Año: rellenados con datos del catálogo estático */}
      <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-3">
        <HeroSelect
          id="hero-marca"
          label="Marca"
          options={marcasOptions}
          value={marca}
          onChange={(v) => {
            setMarca(v);
            setModelo(PLACEHOLDER_MODELO);
          }}
          placeholder={PLACEHOLDER_MARCA}
        />
        <HeroSelect
          id="hero-modelo"
          label="Modelo"
          options={modelosOptions}
          value={modelo}
          onChange={setModelo}
          placeholder={PLACEHOLDER_MODELO}
        />
        <HeroSelect
          id="hero-anio"
          label="Año"
          options={anosOptions}
          value={anio}
          onChange={setAnio}
          placeholder={PLACEHOLDER_ANIO}
        />
      </div>

      {/* Palabra clave: opcional, debajo de los selects */}
      <div className="mt-3 sm:mt-4">
        <label htmlFor="hero-keyword" className="sr-only">
          Buscá por palabra clave (opcional)
        </label>
        <input
          id="hero-keyword"
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Buscá por palabra clave"
          autoComplete="off"
          className={cn(
            "min-h-[44px] w-full rounded-xl border border-[var(--brand-cream)]/30 bg-[var(--brand-offwhite)]/10 px-3 py-2.5 text-white placeholder:text-[var(--brand-cream)]/60",
            "focus:border-[var(--brand-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-orange)]/40"
          )}
          style={{ fontSize: "16px" }}
        />
      </div>

      {/* Buscar: botón minimalista con acento naranja y feedback táctil */}
      <div className="mt-4 flex justify-center sm:mt-5">
        <Button
          className="w-full border border-[var(--brand-orange)]/80 bg-[var(--brand-orange)]/15 font-medium text-white hover:bg-[var(--brand-orange)]/25 hover:border-[var(--brand-orange)] sm:w-auto sm:min-w-[140px]"
          asChild
        >
          <MotionLink
            href={searchHref}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center justify-center gap-2"
          >
            <Search className="size-4 shrink-0 text-[var(--brand-orange)]" aria-hidden />
            Buscar
          </MotionLink>
        </Button>
      </div>
    </motion.div>
  );
}
