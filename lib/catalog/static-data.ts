/**
 * Catálogo estático generado desde vehiculos.csv (50 autos para desarrollo y testing).
 * Imágenes: URLs de https://api.caradvice.com.ar (estables).
 * Regenerar con: node scripts/build-static-catalog.js
 */
import type { CatalogCar } from "@/lib/catalog/types";
import staticVehicles from "./static/vehicles.json";

export const catalogCars: CatalogCar[] = staticVehicles as CatalogCar[];
