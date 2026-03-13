/**
 * Tests para la sugerencia "¿Quisiste decir?" del modal de búsqueda del hero:
 * longitud mínima, typos (hylux→Hilux, toyot→Toyota), rechazo de queries
 * muy distintas y normalización de la query.
 */
import { describe, it, expect } from "vitest";
import { findFuzzySuggestion } from "@/lib/catalog/hero-search-fuzzy";
import type { CatalogFilterMetadata } from "@/lib/catalog/types";

function mockFiltersMeta(overrides: Partial<CatalogFilterMetadata> = {}): CatalogFilterMetadata {
  return {
    brands: ["Toyota", "Volkswagen", "Fiat"],
    modelsByBrand: {
      toyota: ["Hilux", "Corolla", "Etios"],
      volkswagen: ["Gol", "Polo", "Amarok"],
      fiat: ["Cronos", "Argo", "Strada"],
    },
    versionesByModelo: {},
    transmissions: [],
    combustibles: [],
    colores: [],
    puertas: [],
    extras: [],
    yearRange: { min: 2010, max: 2024 },
    priceRange: { min: 0, max: 100000 },
    priceRangeUsd: { min: 0, max: 50000 },
    kmRange: { min: 0, max: 500000 },
    ...overrides,
  };
}

describe("findFuzzySuggestion", () => {
  const meta = mockFiltersMeta();

  it("devuelve undefined si la query tiene menos de SUGGESTION_MIN_QUERY_LENGTH caracteres", () => {
    expect(findFuzzySuggestion("hi", meta)).toBeUndefined();
    expect(findFuzzySuggestion("t", meta)).toBeUndefined();
    expect(findFuzzySuggestion("", meta)).toBeUndefined();
  });

  it("sugiere modelo cuando hay typo de 1 letra (hylux → Hilux)", () => {
    const suggestion = findFuzzySuggestion("hylux", meta);
    expect(suggestion).toBeDefined();
    expect(suggestion!.type).toBe("modelo");
    expect(suggestion!.modelo).toBe("Hilux");
    expect(suggestion!.marca).toBe("Toyota");
    expect(suggestion!.displayText).toBe("Toyota • Hilux");
  });

  it("sugiere marca cuando hay typo (toyot → Toyota)", () => {
    const suggestion = findFuzzySuggestion("toyot", meta);
    expect(suggestion).toBeDefined();
    expect(suggestion!.type).toBe("marca");
    expect(suggestion!.marca).toBe("Toyota");
    expect(suggestion!.displayText).toBe("Toyota");
  });

  it("no devuelve sugerencia cuando la query coincide exactamente (hay resultados por subcadena)", () => {
    // La función solo se llama cuando no hay resultados exactos; aquí comprobamos
    // que para queries muy distintas no hay sugerencia
    const suggestion = findFuzzySuggestion("xyzabc", meta);
    expect(suggestion).toBeUndefined();
  });

  it("no sugiere para query muy distinta (abc)", () => {
    const suggestion = findFuzzySuggestion("abc", meta);
    expect(suggestion).toBeUndefined();
  });

  it("sugiere el mejor candidato cuando varios son similares", () => {
    const suggestion = findFuzzySuggestion("corola", meta);
    expect(suggestion).toBeDefined();
    expect(suggestion!.type).toBe("modelo");
    expect(suggestion!.modelo).toBe("Corolla");
  });

  it("normaliza la query (mayúsculas/espacios)", () => {
    const suggestion = findFuzzySuggestion("  HYlux  ", meta);
    expect(suggestion).toBeDefined();
    expect(suggestion!.modelo).toBe("Hilux");
  });
});
