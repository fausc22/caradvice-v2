/**
 * Home — Página principal.
 * Orden: hero, tipología, financiación, carrusel de autos, consignación, reseñas.
 * HomeContent (cliente) centraliza el estado del modal de consignación para Hero y banner.
 */
import { HomeContent } from "@/components/home/home-content";
import { getCatalogFilterMetadata } from "@/lib/catalog";

export default async function Home() {
  const filtersMeta = await getCatalogFilterMetadata();

  return <HomeContent filtersMeta={filtersMeta} />;
}
