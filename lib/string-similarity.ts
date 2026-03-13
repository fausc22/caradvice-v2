/**
 * Utilidad de similitud entre strings para búsqueda "did you mean".
 * Usado en el modal de búsqueda del hero cuando no hay resultados exactos.
 *
 * Uso típico: combinar ratio de similitud (ej. >= 0.7) con un tope de
 * distancia de edición (ej. <= 2) para evitar sugerir términos poco relacionados.
 */

/**
 * Distancia de Levenshtein: mínimo número de inserciones, eliminaciones o
 * sustituciones para transformar `a` en `b`.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Ratio de similitud en [0, 1]: 1 = idénticos, 0 = sin relación.
 * Usa 1 - (distancia / max(longitudes)) para normalizar.
 */
export function similarityRatio(a: string, b: string): number {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length, 1);
  const distance = levenshteinDistance(a, b);
  return 1 - distance / maxLen;
}
