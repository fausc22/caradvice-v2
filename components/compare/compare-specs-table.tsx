"use client";

import React from "react";
import type { CatalogCar } from "@/lib/catalog/types";
import { COMPARE_SPEC_SECTIONS } from "@/lib/compare-specs";
import { SpecRowTable, SpecRowMobile } from "@/components/compare/spec-row";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CompareSpecsTableProps = {
  vehicles: CatalogCar[];
};

export function CompareSpecsTable({ vehicles }: CompareSpecsTableProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--brand-gray)]/40 bg-card shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
      <div className="px-4 py-4 sm:px-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-2xl">
          Especificaciones
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tabla comparativa por atributos clave.
        </p>
      </div>

      {/* Móvil: pestañas por vehículo + lista vertical de specs (sin scroll horizontal) */}
      <div className="px-4 pb-6 md:hidden">
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="mb-4 w-full overflow-x-auto flex-nowrap justify-start rounded-xl bg-muted p-1">
            {vehicles.map((car, index) => (
              <TabsTrigger
                key={car.slug}
                value={String(index)}
                className="shrink-0 rounded-lg px-3 text-xs"
              >
                {index + 1}. {car.brand} {car.model}
              </TabsTrigger>
            ))}
          </TabsList>
          {vehicles.map((car, index) => (
            <TabsContent key={car.slug} value={String(index)} className="mt-0 space-y-4">
              {COMPARE_SPEC_SECTIONS.map((section) => (
                <section key={section.id}>
                  <h3 className="mb-2 text-xs font-black uppercase tracking-tight text-[var(--brand-black)]">
                    {section.title}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {section.rows.map((row) => (
                      <SpecRowMobile
                        key={row.key}
                        label={row.label}
                        value={row.getValue(car)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Desktop: tabla comparativa con sticky headers */}
      <div className="hidden px-6 pb-6 md:block">
        <SpecsMatrixTable vehicles={vehicles} />
      </div>
    </article>
  );
}

function SpecsMatrixTable({ vehicles }: { vehicles: CatalogCar[] }) {
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full min-w-[680px] border-collapse"
        aria-label="Tabla comparativa de especificaciones de vehículos"
      >
        <thead>
          <tr className="border-b-2 border-[var(--brand-gray)]/50 bg-[var(--brand-cream)]/40">
            <th
              scope="col"
              className="sticky left-0 top-0 z-30 min-w-[220px] bg-[var(--brand-cream)]/40 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--brand-dark)] shadow-[2px_0_4px_rgba(0,0,0,0.04)]"
            >
              Especificación
            </th>
            {vehicles.map((car) => (
              <th
                key={car.slug}
                scope="col"
                aria-label={`Columna de ${car.brand} ${car.model}`}
                className="sticky top-0 z-20 min-w-[210px] bg-[var(--brand-cream)]/40 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--brand-black)]"
              >
                <span className="line-clamp-1">{car.brand} {car.model}</span>
                <span className="mt-0.5 block text-[10px] font-medium normal-case text-muted-foreground">
                  {car.version}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_SPEC_SECTIONS.map((section) => (
            <React.Fragment key={section.id}>
              <tr className="bg-[var(--brand-offwhite)]/80">
                <th
                  colSpan={vehicles.length + 1}
                  scope="colgroup"
                  className="sticky left-0 z-10 bg-[var(--brand-offwhite)]/80 px-4 py-2 text-left text-sm font-black uppercase tracking-tight text-[var(--brand-black)]"
                >
                  {section.title}
                </th>
              </tr>
              {section.rows.map((row) => (
                <SpecRowTable
                  key={row.key}
                  label={row.label}
                  values={vehicles.map((c) => row.getValue(c))}
                  className="odd:bg-card even:bg-[var(--brand-cream)]/20"
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
