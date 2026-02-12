"use client";

/**
 * Bloque de filtros del hero. Arma la URL de /catalogo con query params.
 * Backend: tipo, marca, modelo, anio y q (palabra clave) son los nombres esperados en la API de búsqueda.
 */
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSelect } from "@/components/home/hero-select";
import { buildCatalogUrl, type CatalogTipo } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const TIPO_OPTIONS = [
  { value: "usados" as const, label: "Usados" },
  { value: "nuevos" as const, label: "Nuevos" },
  { value: "motos" as const, label: "Motos" },
] as const;

// Opciones estáticas; reemplazar por fetch desde API (marcas/modelos por tipo, años)
const MARCAS = ["Elegí la marca", "Toyota", "Ford", "Volkswagen", "Fiat", "Chevrolet", "Honda", "Otro"];
const MODELOS = ["Elegí el modelo", "Modelo A", "Modelo B", "Otro"];
const ANOS = ["Elegí el año", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018 o anterior"];

export function HeroFilters() {
  const [selectedTipo, setSelectedTipo] = useState<CatalogTipo>("usados");
  const [marca, setMarca] = useState(MARCAS[0]);
  const [modelo, setModelo] = useState(MODELOS[0]);
  const [anio, setAnio] = useState(ANOS[0]);
  const [keyword, setKeyword] = useState("");

  const parsedYear = Number.parseInt(anio, 10);
  const hasYear = Number.isFinite(parsedYear);

  const searchHref = buildCatalogUrl({
    q: keyword.trim() || undefined,
    tipo: selectedTipo,
    marca: marca !== MARCAS[0] ? marca : undefined,
    modelo: modelo !== MODELOS[0] ? modelo : undefined,
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
      className="w-full max-w-2xl rounded-xl border border-white/20 bg-white/10 px-4 py-5 backdrop-blur-sm sm:px-6 sm:py-6"
    >
      {/* Tipo: Usados / Nuevos / Motos — sutil, sin recuadro ni flecha */}
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        {TIPO_OPTIONS.map(({ value, label }) => {
          const isSelected = selectedTipo === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedTipo(value)}
              className={cn(
                "text-base font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/10",
                isSelected ? "text-[var(--brand-orange)]" : "text-white/75 hover:text-white"
              )}
              aria-pressed={isSelected}
              aria-label={`Filtrar por ${label}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Marca, Modelo, Año: selects con estilos de la página */}
      <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-3">
        <HeroSelect
          id="hero-marca"
          label="Marca"
          options={MARCAS}
          value={marca}
          onChange={setMarca}
          placeholder={MARCAS[0]}
        />
        <HeroSelect
          id="hero-modelo"
          label="Modelo"
          options={MODELOS}
          value={modelo}
          onChange={setModelo}
          placeholder={MODELOS[0]}
        />
        <HeroSelect
          id="hero-anio"
          label="Año"
          options={ANOS}
          value={anio}
          onChange={setAnio}
          placeholder={ANOS[0]}
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
            "w-full rounded-lg border border-white/30 bg-white/15 px-3 py-2.5 text-sm text-white",
            "placeholder:text-white/60",
            "focus:border-[var(--brand-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]/50"
          )}
        />
      </div>

      {/* Buscar */}
      <div className="mt-4 flex justify-center sm:mt-5">
        <Button
          className="w-full bg-[var(--brand-orange)] font-medium hover:bg-[var(--brand-orange-light)] sm:w-auto sm:min-w-[140px]"
          asChild
        >
          <Link href={searchHref} className="inline-flex items-center justify-center gap-2">
            <Search className="size-4 shrink-0" aria-hidden />
            Buscar
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
