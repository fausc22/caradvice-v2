import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mobile-first: no cambios especiales; viewport en layout.
  // Para imágenes externas (ej. CDN de fotos): descomentar y agregar dominios:
  // images: { remotePatterns: [{ protocol: "https", hostname: "ejemplo.com", pathname: "/**" }] },
};

export default nextConfig;
