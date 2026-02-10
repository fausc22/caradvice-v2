"use client";

import { useEffect, useRef } from "react";

/**
 * Widget de reseñas Trustindex (Car Advice).
 * Inyecta el script en el contenedor para que el widget se renderice en su lugar.
 */
export default function TrustindexWidget() {
  const widgetId = "855b5c856aad24344896429404f";
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current || !containerRef.current) return;

    const existingScript = document.getElementById(
      `trustindex-script-${widgetId}`
    );
    if (existingScript) {
      scriptLoadedRef.current = true;
      return;
    }

    const script = document.createElement("script");
    script.id = `trustindex-script-${widgetId}`;
    script.src = `https://cdn.trustindex.io/loader.js?${widgetId}`;
    script.defer = true;
    script.async = true;
    containerRef.current.appendChild(script);
    scriptLoadedRef.current = true;
  }, [widgetId]);

  return <div ref={containerRef} />;
}
