# Catálogo estático (50 autos)

Dataset generado desde `vehiculos.csv` para desarrollo y testing sin backend.

- **Origen:** `vehiculos.csv` (catálogo Meta, actualizado).
- **Imágenes:** URLs de `https://api.caradvice.com.ar` (estables).
- **Regenerar:** desde la raíz del repo: `node scripts/build-static-catalog.js`

El script selecciona 50 autos maximizando cobertura de marcas, tipologías, transmisiones y combustibles para que filtros, catálogo, detalle y home devuelvan resultados realistas.
