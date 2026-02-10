import { z } from "zod";

/**
 * Esquemas Zod para formularios (react-hook-form + @hookform/resolvers/zod).
 * Mantener nombres de campos alineados con el backend al integrar (ej. name, phone, message).
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  phone: z.string().min(8, "Teléfono inválido"),
  message: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
