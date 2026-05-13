"use client";

import { ICON_OPTIONS } from "@/lib/constants";
import * as LucideIcons from "lucide-react";
import { Check } from "lucide-react";

interface IconPickerProps {
  value?: string;
  onChange: (icon: string | undefined) => void;
  label?: string;
}

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;

function getIcon(name: string): LucideIconComponent | null {
  const icon = (LucideIcons as Record<string, unknown>)[name];
  return (icon as LucideIconComponent) || null;
}

export default function IconPicker({
  value,
  onChange,
  label = "Icon",
}: IconPickerProps) {
  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-soft-brown">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={`w-9 h-9 rounded-lg border transition-all duration-200
            flex items-center justify-center text-xs
            ${!value ? "border-soft-brown bg-parchment" : "border-warm-gray-light/50 hover:border-warm-gray bg-white/60"}`}
          aria-label="No icon"
        >
          {!value ? <Check size={14} /> : "—"}
        </button>
        {ICON_OPTIONS.map((name) => {
          const Icon = getIcon(name);
          if (!Icon) return null;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              className={`w-9 h-9 rounded-lg border transition-all duration-200
                flex items-center justify-center
                ${value === name ? "border-soft-brown bg-parchment" : "border-warm-gray-light/50 hover:border-warm-gray bg-white/60"}`}
              aria-label={name}
            >
              <Icon size={18} className="text-soft-brown" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { getIcon };
