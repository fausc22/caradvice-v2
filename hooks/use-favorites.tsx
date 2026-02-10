"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_KEY = "caweb:favorites:v1";

type FavoritesContextValue = {
  favoriteSlugs: string[];
  isHydrated: boolean;
  favoriteCount: number;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) {
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized = parsed.filter(
          (item): item is string => typeof item === "string",
        );
        setFavoriteSlugs(Array.from(new Set(normalized)));
      }
    } catch {
      setFavoriteSlugs([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoriteSlugs),
    );
  }, [favoriteSlugs, isHydrated]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== FAVORITES_STORAGE_KEY) {
        return;
      }

      try {
        const next = event.newValue ? JSON.parse(event.newValue) : [];
        if (Array.isArray(next)) {
          const normalized = next.filter(
            (item): item is string => typeof item === "string",
          );
          setFavoriteSlugs(Array.from(new Set(normalized)));
        }
      } catch {
        setFavoriteSlugs([]);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteSlugs,
      isHydrated,
      favoriteCount: favoriteSlugs.length,
      isFavorite: (slug: string) => favoriteSlugs.includes(slug),
      toggleFavorite: (slug: string) => {
        setFavoriteSlugs((prev) =>
          prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug],
        );
      },
      removeFavorite: (slug: string) => {
        setFavoriteSlugs((prev) => prev.filter((item) => item !== slug));
      },
      clearFavorites: () => {
        setFavoriteSlugs([]);
      },
    }),
    [favoriteSlugs, isHydrated],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
