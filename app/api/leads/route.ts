import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/leads — Recibe datos del formulario de contacto.
 * Por ahora responde OK; se puede conectar a backend/DB/email más adelante.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, name, email, phone, message } = body as {
      source?: string;
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { message: "Nombre y email son obligatorios." },
        { status: 400 }
      );
    }

    // TODO: enviar a backend, guardar en DB o enviar email
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Error al procesar el mensaje." },
      { status: 500 }
    );
  }
}
