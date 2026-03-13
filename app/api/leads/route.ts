import { NextRequest, NextResponse } from "next/server";

/** Payload enviado por el cliente (ContactForm o ContactLeadForm). */
type LeadPayload = {
  source?: "contact" | "vdp";
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  /** Solo cuando source === "vdp": etiqueta del vehículo (ej. "Volkswagen Golf Highline (2020)"). */
  vehicleLabel?: string;
  /** Solo cuando source === "vdp": slug del vehículo para identificar la ficha. */
  vehicleSlug?: string;
};

/** Lead normalizado listo para persistencia (backend, DB, email). */
export type LeadRecord = {
  source: "contact" | "vdp";
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Presente solo cuando source === "vdp". */
  vehicleLabel?: string;
  vehicleSlug?: string;
};

/**
 * POST /api/leads
 *
 * Recibe leads del formulario de contacto (source: "contact") o de la ficha del auto (source: "vdp").
 * - contact: name, email, phone, message obligatorios según formulario; phone opcional en payload.
 * - vdp: name, email, phone, message obligatorios; vehicleLabel y vehicleSlug opcionales para identificar el vehículo.
 *
 * Por ahora responde OK. Para conectar backend/DB/email: usar buildLeadRecord() y persistir el resultado.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadPayload;
    const { source, name, email, phone, message, vehicleLabel, vehicleSlug } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { message: "Nombre y email son obligatorios." },
        { status: 400 }
      );
    }

    if (source === "vdp" && !phone?.trim()) {
      return NextResponse.json(
        { message: "El teléfono es obligatorio para consultas por vehículo." },
        { status: 400 }
      );
    }

    const lead: LeadRecord = {
      source: source === "vdp" ? "vdp" : "contact",
      name: name.trim(),
      email: email.trim(),
      phone: (phone ?? "").trim(),
      message: (message ?? "").trim(),
      ...(source === "vdp" && {
        vehicleLabel: vehicleLabel?.trim(),
        vehicleSlug: vehicleSlug?.trim(),
      }),
    };

    // TODO: persistir lead (backend, DB, email, CRM). Usar el objeto `lead` que ya incluye vehicleLabel/vehicleSlug cuando source === "vdp".
    void lead;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Error al procesar el mensaje." },
      { status: 500 }
    );
  }
}
