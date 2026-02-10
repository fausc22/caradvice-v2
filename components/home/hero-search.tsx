"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIPO_OPTIONS = [
  { value: "usados" as const, label: "Usados" },
  { value: "nuevos" as const, label: "Nuevos" },
  { value: "motos" as const, label: "Motos" },
] as const;

export function HeroSearch() {
  const [selectedTipo, setSelectedTipo] = useState<"usados" | "nuevos" | "motos">("usados");

  return (
    <>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {TIPO_OPTIONS.map(({ value, label }) => {
          const isSelected = selectedTipo === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedTipo(value)}
              className={cn(
                "relative flex flex-col items-center gap-1 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50",
                isSelected
                  ? "text-[var(--brand-orange)]"
                  : "text-white/70 hover:text-white"
              )}
              aria-pressed={isSelected}
              aria-label={`Filtrar por ${label}`}
            >
              <span>{label}</span>
              {isSelected && (
                <span
                  className="text-[var(--brand-orange)]"
                  aria-hidden
                >
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    className="inline-block"
                  >
                    <path
                      d="M5 0L10 6L0 6Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-md border border-white/30 bg-white/10 px-3 py-2.5 text-sm text-white/90 backdrop-blur-sm">
          Marca
        </div>
        <div className="rounded-md border border-white/30 bg-white/10 px-3 py-2.5 text-sm text-white/90 backdrop-blur-sm">
          Modelo
        </div>
        <div className="rounded-md border border-white/30 bg-white/10 px-3 py-2.5 text-sm text-white/90 backdrop-blur-sm">
          Año
        </div>
      </div>
      <div className="mt-4">
        <Button
          className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-light)]"
          asChild
        >
          <Link href={`/catalogo?tipo=${selectedTipo}`}>Buscar</Link>
        </Button>
      </div>
    </>
  );
}
