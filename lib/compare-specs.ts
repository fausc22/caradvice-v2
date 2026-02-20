import type { CatalogCar } from "@/lib/catalog/types";
import { CATALOG_TIPOLOGIA_LABELS } from "@/lib/catalog/types";
import { formatSpecLabel, formatVehiclePrice } from "@/lib/utils";

const formatNumber = new Intl.NumberFormat("es-AR");

export type SpecSection = {
  id: string;
  title: string;
  rows: {
    key: string;
    label: string;
    getValue: (car: CatalogCar) => string | number | undefined;
  }[];
};

/** Secciones y filas para la tabla de comparación. Orden: General, Precio, Motor, Equipamiento. */
export const COMPARE_SPEC_SECTIONS: SpecSection[] = [
  {
    id: "general",
    title: "General",
    rows: [
      {
        key: "brandModel",
        label: "Marca / Modelo",
        getValue: (c) => `${c.brand} ${c.model}`,
      },
      { key: "version", label: "Versión", getValue: (c) => c.version },
      { key: "year", label: "Año", getValue: (c) => c.year },
      {
        key: "km",
        label: "Kilometraje",
        getValue: (c) => `${formatNumber.format(c.km)} km`,
      },
      {
        key: "condicion",
        label: "Condición",
        getValue: (c) => formatSpecLabel(c.condicion),
      },
      { key: "type", label: "Tipo", getValue: (c) => formatSpecLabel(c.type) },
      {
        key: "tipologia",
        label: "Tipología",
        getValue: (c) => CATALOG_TIPOLOGIA_LABELS[c.tipologia] ?? c.tipologia,
      },
    ],
  },
  {
    id: "precio",
    title: "Precio",
    rows: [
      {
        key: "priceArs",
        label: "Precio (ARS)",
        getValue: (c) =>
          c.priceArs > 0
            ? `$${formatNumber.format(c.priceArs)}`
            : "—",
      },
      {
        key: "priceUsd",
        label: "Precio (USD)",
        getValue: (c) =>
          c.priceUsd > 0
            ? `USD ${formatNumber.format(c.priceUsd)}`
            : "—",
      },
      {
        key: "priceDisplay",
        label: "Precio final",
        getValue: (c) => formatVehiclePrice(c.priceArs, c.priceUsd),
      },
    ],
  },
  {
    id: "motor",
    title: "Motor / Transmisión",
    rows: [
      { key: "transmission", label: "Transmisión", getValue: (c) => c.transmission },
      { key: "fuel", label: "Combustible", getValue: (c) => c.fuel },
    ],
  },
  {
    id: "equipamiento",
    title: "Equipamiento",
    rows: [
      {
        key: "color",
        label: "Color",
        getValue: (c) => c.color ?? "—",
      },
      {
        key: "puertas",
        label: "Puertas",
        getValue: (c) =>
          c.puertas !== undefined && c.puertas !== null ? c.puertas : "—",
      },
      {
        key: "extras",
        label: "Equipamiento destacado",
        getValue: (c) =>
          c.extras && c.extras.length > 0 ? c.extras.join(" · ") : "—",
      },
    ],
  },
];
