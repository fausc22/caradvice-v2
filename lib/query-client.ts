import { QueryClient } from "@tanstack/react-query";

/**
 * Cliente singleton de React Query (evita duplicados en Strict Mode / HMR).
 * Al integrar backend: usar queryKeys centralizados (ej. lib/api/keys.ts) y opcionalmente
 * defaultOptions.queries.queryFn con baseURL desde env.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
