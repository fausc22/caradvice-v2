"use client";

/**
 * Modal genérico para flujos de negocio (Tasación, Consignación, etc.).
 * Usa Radix Dialog: overlay, cierre con Escape y clic fuera, focus trap.
 * En mobile: pantalla completa, bloquea navegación (no cierra al tocar fuera).
 * - Header (título + X) fijo; solo el body hace scroll (overflow-y-auto).
 */
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg";

const sizeClasses: Record<ModalSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-xl",
};

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Contenido principal; con scroll si es largo. */
  children: React.ReactNode;
  /** Tamaño del contenedor. Por defecto md. */
  size?: ModalSize;
  /** Clase adicional en el contenedor del contenido. */
  className?: string;
  /** Si true, el título usa estilo más compacto. */
  titleCompact?: boolean;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  size = "md",
  className,
  titleCompact = false,
}: ModalProps) {
  const isMobile = useIsMobile();

  // En mobile: bloquear scroll del body mientras el modal está abierto (mismo comportamiento que filtros/búsqueda).
  useEffect(() => {
    if (!open || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "grid p-0 gap-0",
          "fixed inset-0 z-50 h-screen max-h-screen w-screen max-w-none rounded-none translate-x-0 translate-y-0",
          "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[90vh] sm:w-[calc(100vw-2rem)] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl",
          "border-0 sm:border border-[var(--brand-gray)]/40 bg-card",
          "shadow-none sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)] duration-200",
          "pb-[max(env(safe-area-inset-bottom),1rem)]",
          sizeClasses[size],
          className
        )}
        showCloseButton={true}
        aria-describedby={undefined}
        onPointerDownOutside={(e) => {
          if (isMobile) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isMobile) e.preventDefault();
        }}
      >
        <div className="flex flex-col h-full max-h-[100dvh] min-h-0 sm:max-h-[90vh]">
          <header className="shrink-0 border-b border-border px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
            <DialogTitle
              className={cn(
                "text-foreground pr-8",
                titleCompact
                  ? "text-lg font-bold"
                  : "text-xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-2xl"
              )}
            >
              {title}
            </DialogTitle>
          </header>
          <div
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 sm:py-5"
            id="modal-body"
          >
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
