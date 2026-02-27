/**
 * Estilos compartidos para formularios (modales Tasación, Consignación, bloque VDP).
 * Misma apariencia que ContactForm y AutoDetailCalculators.
 */

/** Clase para inputs de texto, número, tel, email. Altura 44px (h-11), focus ring naranja. */
export const inputClass =
  "h-11 w-full rounded-lg border border-black/15 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]";

/** Clase para labels de formulario. */
export const labelClass =
  "mb-1.5 block text-sm font-semibold text-foreground";

/** Clase para textarea (misma familia que inputClass). */
export const textareaClass =
  "min-h-[100px] w-full resize-none rounded-lg border border-black/15 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]";
