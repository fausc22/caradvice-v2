"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Fuel } from "lucide-react";
import type { CatalogCar } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const formatNumber = new Intl.NumberFormat("es-AR");

type AutoDetailSpecsProps = {
  car: CatalogCar;
};

const MOBILE_BREAKPOINT = 640;

export function AutoDetailSpecs({ car }: AutoDetailSpecsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <article className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-2xl">
            Especificaciones principales
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Información relevante para comparar este vehículo.
          </p>
        </div>
        {isMobile && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="specs-content"
            aria-label={isOpen ? "Cerrar especificaciones" : "Desplegar especificaciones"}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
          >
            <ChevronDown
              className={cn("size-5 transition-transform duration-200", isOpen && "rotate-180")}
              aria-hidden
            />
          </button>
        )}
      </div>

      <div
        id="specs-content"
        role="region"
        className={cn(
          "mt-5 grid gap-3 sm:grid-cols-2",
          isMobile && !isOpen && "hidden",
        )}
      >
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Marca / Modelo
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">
            {car.brand} {car.model}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Versión
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">{car.version}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Año
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">{car.year}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Kilometraje
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">
            {formatNumber.format(car.km)} km
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Transmisión
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">
            {car.transmission}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Combustible
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-black)]">
            <Fuel className="size-4 text-[var(--brand-orange)]" aria-hidden />
            {car.fuel}
          </p>
        </div>
        {car.color && (
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Color
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">{car.color}</p>
          </div>
        )}
        {car.puertas !== undefined && (
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Puertas
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">{car.puertas}</p>
          </div>
        )}
        {car.extras && car.extras.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/20 p-3 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Equipamiento destacado
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">
              {car.extras.join(" · ")}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
