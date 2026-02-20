import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases Tailwind sin pisarse; uso habitual en componentes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formato de precio según moneda del vehículo (cada auto tiene solo ARS o solo USD).
 * ARS: "$20.000.000" | USD: "USD 20.000"
 */
export function formatVehiclePrice(priceArs: number, priceUsd: number): string {
  if (priceUsd > 0) {
    return `USD ${priceUsd.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
  }
  return `$${priceArs.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}

/** Para mostrar condicion, tipo, etc. (0km → "0 km", snake_case → espacios). */
export function formatSpecLabel(value: string): string {
  if (value === "0km") return "0 km";
  return value.replaceAll("_", " ");
}
