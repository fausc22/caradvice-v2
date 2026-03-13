/**
 * Tests para la utilidad de similitud entre strings usada en la búsqueda
 * "¿Quisiste decir?" del modal del hero (Levenshtein y ratio).
 */
import { describe, it, expect } from "vitest";
import {
  levenshteinDistance,
  similarityRatio,
} from "@/lib/string-similarity";

describe("levenshteinDistance", () => {
  it("devuelve 0 para strings idénticos", () => {
    expect(levenshteinDistance("hilux", "hilux")).toBe(0);
    expect(levenshteinDistance("", "")).toBe(0);
  });

  it("devuelve la longitud del otro string si uno está vacío", () => {
    expect(levenshteinDistance("", "hilux")).toBe(5);
    expect(levenshteinDistance("toyota", "")).toBe(6);
  });

  it("detecta un solo carácter de diferencia (hylux → hilux)", () => {
    expect(levenshteinDistance("hylux", "hilux")).toBe(1);
  });

  it("detecta un carácter de menos (toyot → toyota)", () => {
    expect(levenshteinDistance("toyot", "toyota")).toBe(1);
  });

  it("devuelve distancia mayor para strings muy distintos", () => {
    expect(levenshteinDistance("abc", "toyota")).toBe(6);
    expect(levenshteinDistance("xyz", "hilux")).toBe(5);
  });
});

describe("similarityRatio", () => {
  it("devuelve 1 para strings idénticos", () => {
    expect(similarityRatio("hilux", "hilux")).toBe(1);
  });

  it("hylux vs hilux tiene ratio alto (typo de 1 letra)", () => {
    const ratio = similarityRatio("hylux", "hilux");
    expect(ratio).toBeGreaterThanOrEqual(0.8);
    expect(ratio).toBeLessThan(1);
  });

  it("toyot vs toyota tiene ratio alto", () => {
    const ratio = similarityRatio("toyot", "toyota");
    expect(ratio).toBeGreaterThanOrEqual(0.8);
  });

  it("devuelve ratio bajo para strings muy distintos", () => {
    const ratio = similarityRatio("abc", "toyota");
    expect(ratio).toBeLessThan(0.5);
  });
});
