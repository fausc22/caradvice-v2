"use client";

import { useState, useCallback, useId, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

/** SUV que reemplaza visualmente cada punta del rango (thumb). */
function SliderCar({ percent, facingRight }: { percent: number; facingRight: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 z-10 transition-[left] duration-200 ease-out"
      style={{
        left: `${percent}%`,
        transform: `translate(-50%, -50%)${facingRight ? "" : " scaleX(-1)"}`,
      }}
    >
      <svg
        width="36"
        height="20"
        viewBox="0 0 36 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[var(--brand-orange)] drop-shadow-md"
      >
        {/* Ruedas grandes (estilo SUV) */}
        <circle cx="8" cy="15" r="3.5" fill="currentColor" />
        <circle cx="28" cy="15" r="3.5" fill="currentColor" />
        {/* Base baja y ancha */}
        <rect x="2" y="10" width="32" height="4" rx="1" fill="currentColor" />
        {/* Cuerpo principal (alto, voluminoso) */}
        <rect x="4" y="5" width="28" height="6" rx="1" fill="currentColor" />
        {/* Cabina SUV (techo alto, más cuadrada) */}
        <rect x="10" y="1" width="16" height="5" rx="0.5" fill="currentColor" />
      </svg>
    </div>
  );
}

const FIELD_STYLE =
  "h-10 min-h-[44px] w-full rounded-xl border border-border bg-card px-3 text-sm outline-none transition-all duration-300 ease-out placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] touch-manipulation";

type DualRangeFilterProps = {
  label: string;
  min: number;
  max: number;
  valueMin?: number;
  valueMax?: number;
  step?: number;
  formatDisplay: (n: number) => string;
  onValueChange?: (min?: number, max?: number) => void;
  /** When true, onValueChange is called on slider/input change. When false, values stay local for form submit. */
  applyOnChange?: boolean;
  nameMin: string;
  nameMax: string;
  idPrefix?: string;
};

export function DualRangeFilter({
  label,
  min,
  max,
  valueMin,
  valueMax,
  step = 1,
  formatDisplay,
  onValueChange,
  applyOnChange = false,
  nameMin,
  nameMax,
  idPrefix = "",
}: DualRangeFilterProps) {
  const baseId = useId().replace(/:/g, "");
  const id = (s: string) => (idPrefix ? `${idPrefix}-${s}` : `${baseId}-${s}`);

  const [localMin, setLocalMin] = useState<string>(
    valueMin !== undefined ? String(valueMin) : "",
  );
  const [localMax, setLocalMax] = useState<string>(
    valueMax !== undefined ? String(valueMax) : "",
  );
  const commitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalMin(valueMin !== undefined ? String(valueMin) : "");
    setLocalMax(valueMax !== undefined ? String(valueMax) : "");
  }, [valueMin, valueMax]);

  useEffect(() => {
    return () => {
      if (commitTimeoutRef.current) {
        clearTimeout(commitTimeoutRef.current);
      }
    };
  }, []);

  const scheduleApply = useCallback(
    (nextMin?: number, nextMax?: number) => {
      if (!applyOnChange || !onValueChange) return;
      if (commitTimeoutRef.current) {
        clearTimeout(commitTimeoutRef.current);
      }
      commitTimeoutRef.current = setTimeout(() => {
        onValueChange(nextMin, nextMax);
      }, 450);
    },
    [applyOnChange, onValueChange],
  );

  const handleSliderChange = useCallback(
    (values: number[]) => {
      const [a, b] = values;
      const newMin = a === min ? undefined : a;
      const newMax = b === max ? undefined : b;
      setLocalMin(newMin !== undefined ? String(newMin) : "");
      setLocalMax(newMax !== undefined ? String(newMax) : "");
    },
    [min, max],
  );

  const handleSliderCommit = useCallback(
    (values: number[]) => {
      const [a, b] = values;
      const newMin = a === min ? undefined : a;
      const newMax = b === max ? undefined : b;
      scheduleApply(newMin, newMax);
    },
    [min, max, scheduleApply],
  );

  const handleInputBlurMin = useCallback(() => {
    const raw = localMin.trim();
    const num = raw ? Number(raw) : undefined;
    const valid =
      num === undefined || (!Number.isNaN(num) && num >= min && num <= max);
    if (applyOnChange && valid) {
      scheduleApply(num, valueMax);
    }
  }, [localMin, applyOnChange, scheduleApply, valueMax, min, max]);

  const handleInputBlurMax = useCallback(() => {
    const raw = localMax.trim();
    const num = raw ? Number(raw) : undefined;
    const valid =
      num === undefined || (!Number.isNaN(num) && num >= min && num <= max);
    if (applyOnChange && valid) {
      scheduleApply(valueMin, num);
    }
  }, [localMax, applyOnChange, scheduleApply, valueMin, min, max]);

  const low = localMin
    ? Math.min(Math.max(Number(localMin), min), max)
    : min;
  const high = localMax
    ? Math.min(Math.max(Number(localMax), min), max)
    : max;
  const sliderValue: [number, number] = [Math.min(low, high), Math.max(low, high)];

  const rangeSpan = max - min;
  const lowPercent =
    rangeSpan <= 0 ? 0 : Math.max(0, Math.min(100, ((low - min) / rangeSpan) * 100));
  const highPercent =
    rangeSpan <= 0 ? 100 : Math.max(0, Math.min(100, ((high - min) / rangeSpan) * 100));

  const inputMinVal =
    localMin === "" ? "" : formatDisplay(Number(localMin));
  const inputMaxVal =
    localMax === "" ? "" : formatDisplay(Number(localMax));

  const placeholderMin = formatDisplay(min);
  const placeholderMax = formatDisplay(max);

  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
      ) : null}
      <div className="relative w-full min-h-[2.5rem] [&_[data-slot=slider-thumb]]:opacity-0">
        <SliderCar percent={lowPercent} facingRight />
        <SliderCar percent={highPercent} facingRight={false} />
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          min={min}
          max={max}
          step={step}
          className="w-full px-0"
          thumbClassName="!min-w-9 !min-h-9 !-translate-x-1/2 !-translate-y-1/2"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="hidden" name={nameMin} value={localMin} />
        <Input
          id={id("min")}
          type="text"
          inputMode="numeric"
          value={inputMinVal}
          onChange={(e) => setLocalMin(e.target.value.replace(/\D/g, ""))}
          onBlur={handleInputBlurMin}
          placeholder={placeholderMin}
          className={FIELD_STYLE}
        />
        <input type="hidden" name={nameMax} value={localMax} />
        <Input
          id={id("max")}
          type="text"
          inputMode="numeric"
          value={inputMaxVal}
          onChange={(e) => setLocalMax(e.target.value.replace(/\D/g, ""))}
          onBlur={handleInputBlurMax}
          placeholder={placeholderMax}
          className={FIELD_STYLE}
        />
      </div>
    </div>
  );
}
