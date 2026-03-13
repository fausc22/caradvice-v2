/**
 * Helpers para variantes de card/detalle (oferta, oportunidad, vendido).
 * Una sola fuente de verdad para defaults y textos de display.
 */
import type { CardVariant, SoldLabel } from "./types";

type WithCardVariant = { cardVariant?: CardVariant };

/** Variante efectiva: si no viene en el auto, se considera "normal". */
export function getCardVariant(car: WithCardVariant): CardVariant {
  return car.cardVariant ?? "normal";
}

/** Texto para mostrar como sello/badge cuando el auto está vendido. Siempre "Vendido". */
export function getSoldLabelDisplay(_soldLabel?: SoldLabel): "Vendido" {
  return "Vendido";
}

/** Si el auto tiene precio original para mostrar (oferta). */
export function hasOriginalPrice(car: WithCardVariant & {
  priceOriginalArs?: number;
  priceOriginalUsd?: number;
}): boolean {
  if (getCardVariant(car) !== "oferta") return false;
  return (
    (car.priceOriginalArs != null && car.priceOriginalArs > 0) ||
    (car.priceOriginalUsd != null && car.priceOriginalUsd > 0)
  );
}

/** Si la variante es vendido (overlay, badges). En VDP determina ocultar tasar, financiar, favorito y "personas mirando". */
export function isVendido(car: WithCardVariant): boolean {
  return getCardVariant(car) === "vendido";
}

/** Si la variante es oferta. */
export function isOferta(car: WithCardVariant): boolean {
  return getCardVariant(car) === "oferta";
}

/** Si la variante es oportunidad. */
export function isOportunidad(car: WithCardVariant): boolean {
  return getCardVariant(car) === "oportunidad";
}
