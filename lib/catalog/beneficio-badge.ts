/**
 * Categorías de badge (alineadas a la UI de CarCard): filtran por texto en opportunityBadges.
 */
import type { CatalogBeneficio, CatalogCar } from "@/lib/catalog/types";
import { CATALOG_BENEFICIO_VALUES } from "@/lib/catalog/types";

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function badgeMatchesBeneficio(
  badge: string,
  beneficio: CatalogBeneficio,
): boolean {
  const n = norm(badge);
  switch (beneficio) {
    case "financiacion":
      return n.includes("financ");
    case "retira":
      return n.includes("retira") || /\bdni\b/.test(n);
    case "novedad":
      return (
        n.includes("novedad") ||
        n.includes("nuevo ingreso") ||
        n.includes("nueva ingreso") ||
        (n.includes("nuevo") && !n.includes("financ")) ||
        (n.includes("nueva") && !n.includes("financ"))
      );
    case "destacado":
      return (
        n.includes("destacado") ||
        n.includes("premium") ||
        n.includes("seleccionado")
      );
    default:
      return false;
  }
}

export function carMatchesBeneficioFilter(
  car: CatalogCar,
  beneficio: CatalogBeneficio,
): boolean {
  const badges = car.opportunityBadges ?? [];
  return badges.some((b) => badgeMatchesBeneficio(b, beneficio));
}

/** Beneficios que aparecen al menos en un badge del catálogo (para el desplegable). */
export function collectBeneficiosInCatalog(cars: CatalogCar[]): CatalogBeneficio[] {
  const found = new Set<CatalogBeneficio>();
  for (const car of cars) {
    for (const badge of car.opportunityBadges ?? []) {
      for (const b of CATALOG_BENEFICIO_VALUES) {
        if (badgeMatchesBeneficio(badge, b)) found.add(b);
      }
    }
  }
  return CATALOG_BENEFICIO_VALUES.filter((b) => found.has(b));
}
