"use client";

/**
 * Campo de formulario reutilizable: label + input (o children) + mensaje de error opcional.
 * Usa estilos compartidos de lib/form-styles para consistencia en modales y VDP.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "@/lib/form-styles";

export type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  /** Si no se pasa, se renderiza un input type="text" con las clases compartidas. */
  children?: React.ReactNode;
  /** Solo si children no se usa: tipo del input por defecto. */
  type?: "text" | "email" | "tel" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export function FormField({
  id,
  label,
  required = false,
  error,
  children,
  type = "text",
  placeholder,
  value,
  onChange,
  className,
}: FormFieldProps) {
  const inputEl = (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(inputClass, error && "border-destructive ring-destructive/20")}
    />
  );

  return (
    <div className={cn("space-y-1", className)}>
      <label htmlFor={children ? undefined : id} className={labelClass}>
        {label}
        {required && <span className="text-destructive ml-0.5" aria-hidden>*</span>}
      </label>
      {children ?? inputEl}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
