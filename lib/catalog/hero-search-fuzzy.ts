/**
 * Lógica de sugerencia "¿Quisiste decir?" para el modal de búsqueda del hero.
 * Compara la query con marcas y modelos del catálogo por similitud (Levenshtein)
 * y devuelve el mejor candidato si supera umbral de ratio y tope de distancia.
 */
import { normalizeCatalogString } from "@/lib/catalog/params";
import type { CatalogFilterMetadata } from "@/lib/catalog/types";
import {
  levenshteinDistance,
  similarityRatio,
} from "@/lib/string-similarity";

/** Mínimo de caracteres en la query para activar la sugerencia. */
export const SUGGESTION_MIN_QUERY_LENGTH = 3;
/** Ratio de similitud [0,1] mínimo para proponer un candidato. */
export const SIMILARITY_THRESHOLD = 0.7;
/** Máxima distancia de edición permitida (evita sugerir términos muy distintos). */
export const MAX_EDIT_DISTANCE_FOR_SUGGESTION = 2;

/** Sugerencia "¿Quisiste decir?" cuando no hay resultados y hay un candidato similar. */
export type SearchSuggestion =
  | { type: "marca"; marca: string; displayText: string }
  | { type: "modelo"; marca: string; modelo: string; displayText: string };

/**
 * Devuelve una sugerencia "¿Quisiste decir?" cuando existe un candidato
 * (marca o modelo) con similitud suficiente y a lo sumo
 * MAX_EDIT_DISTANCE_FOR_SUGGESTION caracteres de diferencia.
 */
export function findFuzzySuggestion(
  q: string,
  filtersMeta: CatalogFilterMetadata
): SearchSuggestion | undefined {
  const normalized = normalizeCatalogString(q);
  if (normalized.length < SUGGESTION_MIN_QUERY_LENGTH) return undefined;

  let best: { suggestion: SearchSuggestion; ratio: number } | null = null;

  const isAcceptable = (ratio: number, distance: number) =>
    ratio >= SIMILARITY_THRESHOLD &&
    distance <= MAX_EDIT_DISTANCE_FOR_SUGGESTION &&
    (!best || ratio > best.ratio);

  for (const brand of filtersMeta.brands) {
    const normBrand = normalizeCatalogString(brand);
    const ratio = similarityRatio(normalized, normBrand);
    const distance = levenshteinDistance(normalized, normBrand);
    if (isAcceptable(ratio, distance)) {
      best = {
        suggestion: { type: "marca", marca: brand, displayText: brand },
        ratio,
      };
    }
  }

  for (const [normBrand, modelList] of Object.entries(
    filtersMeta.modelsByBrand
  )) {
    const displayBrand =
      filtersMeta.brands.find(
        (b) => normalizeCatalogString(b) === normBrand
      ) ?? normBrand;
    for (const model of modelList) {
      const normModel = normalizeCatalogString(model);
      const ratioModel = similarityRatio(normalized, normModel);
      const distanceModel = levenshteinDistance(normalized, normModel);
      const combined = `${normBrand} ${normModel}`;
      const ratioBrandModel = similarityRatio(normalized, combined);
      const distanceBrandModel = levenshteinDistance(normalized, combined);
      const ratio = Math.max(ratioModel, ratioBrandModel);
      const distance = Math.min(distanceModel, distanceBrandModel);
      if (isAcceptable(ratio, distance)) {
        best = {
          suggestion: {
            type: "modelo",
            marca: displayBrand,
            modelo: model,
            displayText: `${displayBrand} • ${model}`,
          },
          ratio,
        };
      }
    }
  }

  return best?.suggestion;
}
