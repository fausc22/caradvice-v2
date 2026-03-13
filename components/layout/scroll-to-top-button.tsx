"use client";

/**
 * Botón flotante "Volver arriba" (esquina inferior izquierda).
 * Visible solo tras hacer scroll; no interfiere con el botón de WhatsApp (derecha).
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

const SCROLL_THRESHOLD_PX = 300;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-6 z-30 flex size-12 items-center justify-center rounded-full border border-[var(--brand-gray)]/40 bg-[var(--brand-offwhite)]/95 text-[var(--brand-black)] shadow-md backdrop-blur transition-colors hover:bg-[var(--brand-offwhite)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-offwhite)] sm:bottom-6 sm:left-6 sm:size-14"
          aria-label="Volver arriba"
        >
          <ChevronUp className="size-6 sm:size-7" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
