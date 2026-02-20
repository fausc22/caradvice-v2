import { cn } from "@/lib/utils";

/** Celda de valor individual (evita repetir estilos en tabla). */
export function SpecValue({
  value,
  className,
}: {
  value: string | number | undefined;
  className?: string;
}) {
  const text = value !== undefined && value !== null ? String(value) : "—";
  return (
    <span className={cn("font-semibold text-[var(--brand-black)]", className)}>
      {text}
    </span>
  );
}

/**
 * Fila para tabla desktop: <tr> con th (label) + td por cada valor.
 */
export function SpecRowTable({
  label,
  values,
  className,
  compact = false,
}: {
  label: string;
  values: (string | number | undefined)[];
  className?: string;
  compact?: boolean;
}) {
  return (
    <tr className={cn("border-b border-border", className)}>
      <th
        scope="row"
        className={cn(
          "sticky left-0 z-10 bg-card text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap shadow-[2px_0_4px_rgba(0,0,0,0.03)]",
          compact ? "py-2 pr-3 pl-3" : "py-3 pr-4 pl-4",
        )}
      >
        {label}
      </th>
      {values.map((value, i) => (
        <td key={i} className={cn("text-sm", compact ? "px-3 py-2" : "px-4 py-3")}>
          <SpecValue value={value} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Fila para vista móvil (un vehículo): label + un valor. Estilo tipo AutoDetailSpecs.
 */
export function SpecRowMobile({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number | undefined;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--brand-gray)]/40 bg-[var(--brand-cream)]/20 p-3",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">
        <SpecValue value={value} />
      </p>
    </div>
  );
}
