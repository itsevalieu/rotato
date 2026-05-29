"use client";

import { AlignLeft, Quote, Leaf, ChevronsRight, Mail, Columns } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import type { FormStyle } from "@/lib/types";

const STYLES: { id: FormStyle; label: string; icon: React.ElementType }[] = [
  { id: "classic",      label: "Classic form",     icon: AlignLeft },
  { id: "sentence",     label: "Sentence spell",   icon: Quote },
  { id: "seed-packet",  label: "Seed packet",      icon: Leaf },
  { id: "two-beat",     label: "Two steps",        icon: ChevronsRight },
  { id: "envelope",     label: "Envelope",         icon: Mail },
  { id: "live-preview", label: "Live preview",     icon: Columns },
];

export default function FormStylePicker() {
  const { state, dispatch } = useGarden();
  const current = state.formStyle ?? "classic";

  return (
    <div className="flex items-center gap-0.5 bg-warm-gray-light/20 rounded-xl p-1" title="Change form style">
      {STYLES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => dispatch({ type: "SET_FORM_STYLE", style: id })}
          title={label}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            current === id
              ? "bg-cream text-soft-brown shadow-warm-sm"
              : "text-warm-gray hover:text-soft-brown"
          }`}
        >
          <Icon size={13} />
        </button>
      ))}
    </div>
  );
}
