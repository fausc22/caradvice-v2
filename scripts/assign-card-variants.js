/**
 * Asigna cardVariant a todos los vehículos en vehicles.json con distribución igual:
 * normal, oferta, oportunidad, vendido (round-robin).
 * Uso: node scripts/assign-card-variants.js
 */
const fs = require("fs");
const path = require("path");

const VARIANTS = ["normal", "oferta", "oportunidad", "vendido"];
const jsonPath = path.join(__dirname, "../lib/catalog/static/vehicles.json");
const vehicles = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

vehicles.forEach((car, i) => {
  const variant = VARIANTS[i % VARIANTS.length];
  car.cardVariant = variant;

  if (variant === "oferta") {
    if (car.priceArs > 0) {
      car.priceOriginalArs = Math.round(car.priceArs * 1.12);
      car.discountPercent = 10;
    } else if (car.priceUsd > 0) {
      car.priceOriginalUsd = Math.round(car.priceUsd * 1.12);
      car.discountPercent = 10;
    }
  } else if (variant === "oportunidad") {
    car.opportunityBadges = ["FINANCIACION 15%", "RETIRA CON TU DNI"];
  } else if (variant === "vendido") {
    car.soldLabel = "vendido";
  }
  // normal: no campos extra
});

fs.writeFileSync(jsonPath, JSON.stringify(vehicles, null, 2) + "\n", "utf8");
const counts = VARIANTS.reduce((acc, v) => ({ ...acc, [v]: 0 }), {});
vehicles.forEach((c) => counts[c.cardVariant]++);
console.log("Variantes asignadas:", counts);
