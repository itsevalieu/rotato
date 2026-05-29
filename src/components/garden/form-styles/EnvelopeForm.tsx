"use client";

import { SECTION_META, SECTION_ORDER, PALETTE_COLORS, ICON_OPTIONS } from "@/lib/constants";
import { getIcon } from "@/components/ui/IconPicker";
import type { FormStyleProps } from "./types";

export default function EnvelopeForm({
  title, setTitle,
  description, setDescription,
  inspirationText, setInspirationText,
  tags, setTags,
  nextTinyStep, setNextTinyStep,
  color, setColor,
  icon, setIcon,
  section, setSection,
  isEditing, onSubmit, onClose,
}: FormStyleProps) {
  const sealColor = color || "#C67B5C";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Envelope flap */}
      <div className="relative -mx-6 -mt-2 mb-2 h-14 rounded-xl overflow-hidden">
        <svg
          viewBox="0 0 100 28"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <polygon points="0,0 100,0 100,28 50,8 0,28" fill="#F5EDDE" />
          <line x1="0" y1="0" x2="50" y2="20" stroke="#A8998A" strokeWidth="0.5" opacity="0.5" />
          <line x1="100" y1="0" x2="50" y2="20" stroke="#A8998A" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>

      {/* Title + wax seal row */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <p className="text-xs font-accent text-warm-gray mb-1.5">to whomever finds this —</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title of this endeavour"
            required
            autoFocus
            className="w-full text-xl font-accent text-soft-brown bg-transparent border-0 border-b-2 border-warm-gray-light focus:border-soft-brown pb-1.5 placeholder:text-warm-gray focus:outline-none transition-colors"
          />
        </div>
        {/* Wax seal */}
        <div
          className="shrink-0 w-11 h-11 rounded-full shadow-md flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: sealColor }}
          title="Wax seal colour follows the colour picker below"
        >
          <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center">
            <span className="font-accent text-white text-sm font-bold">R</span>
          </div>
        </div>
      </div>

      {/* Letter body */}
      <div className="bg-parchment/40 rounded-xl px-4 py-3 border border-warm-gray-light/40 space-y-3">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="I write to tell you about this project..."
          rows={2}
          className="w-full font-accent text-sm text-soft-brown bg-transparent border-0 resize-none placeholder:text-warm-gray focus:outline-none leading-relaxed"
        />
        <div className="border-t border-dashed border-warm-gray-light/50 pt-2.5">
          <textarea
            value={inspirationText}
            onChange={(e) => setInspirationText(e.target.value)}
            placeholder="Its inspiration arrives from..."
            rows={1}
            className="w-full text-xs font-accent italic text-soft-brown bg-transparent border-0 resize-none placeholder:text-warm-gray focus:outline-none"
          />
        </div>
      </div>

      {/* P.S. — next step */}
      <div className="flex items-center gap-2">
        <span className="font-accent text-sm text-soft-brown shrink-0">P.S. first, I shall</span>
        <input
          type="text"
          value={nextTinyStep}
          onChange={(e) => setNextTinyStep(e.target.value)}
          placeholder="tiny first step..."
          className="flex-1 font-accent text-sm text-soft-brown bg-transparent border-0 border-b border-dashed border-warm-gray-light/60 focus:border-soft-brown pb-0.5 placeholder:text-warm-gray focus:outline-none transition-colors"
        />
      </div>

      {/* Tags */}
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="labelled: art, music, joy..."
        className="w-full text-xs italic font-accent text-soft-brown bg-transparent border-0 placeholder:text-warm-gray focus:outline-none"
      />

      {/* Postage stamps (section) */}
      <div>
        <p className="text-xs text-warm-gray uppercase tracking-[0.12em] mb-2 font-medium">Postage</p>
        <div className="flex gap-2 flex-wrap">
          {SECTION_ORDER.map((s) => {
            const Icon = getIcon(SECTION_META[s].icon);
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSection(s)}
                className={`flex flex-col items-center gap-0.5 px-2.5 py-2 rounded border-2 text-xs transition-all min-w-[56px] ${
                  section === s
                    ? "border-terracotta bg-terracotta/10 text-terracotta"
                    : "border-dashed border-warm-gray-light/60 text-warm-gray hover:border-warm-gray hover:text-soft-brown"
                }`}
              >
                {Icon && <Icon size={15} />}
                <span className="font-medium leading-tight text-center text-[9px]">
                  {SECTION_META[s].label.split(" ").slice(0, 2).join(" ")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seal colour + mark */}
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-xs text-warm-gray uppercase tracking-[0.12em] mr-1 font-medium">Seal</p>
        <button
          type="button"
          onClick={() => setColor(undefined)}
          className={`w-5 h-5 rounded-full border-2 bg-white/60 transition-all ${
            !color ? "border-soft-brown scale-110" : "border-warm-gray-light/50"
          }`}
          title="No colour"
        />
        {PALETTE_COLORS.map((c) => (
          <button
            key={c.hex}
            type="button"
            onClick={() => setColor(c.hex)}
            className={`w-5 h-5 rounded-full border-2 transition-all ${
              color === c.hex ? "border-soft-brown scale-125" : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.name}
          />
        ))}
        <span className="text-warm-gray/50 mx-0.5 text-xs">·</span>
        <p className="text-xs text-warm-gray uppercase tracking-[0.12em] mr-1 font-medium">Mark</p>
        {ICON_OPTIONS.slice(0, 8).map((name) => {
          const Icon = getIcon(name);
          if (!Icon) return null;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setIcon(icon === name ? undefined : name)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                icon === name
                  ? "bg-parchment border-soft-brown/50 text-soft-brown"
                  : "border-warm-gray-light/40 text-warm-gray hover:text-soft-brown hover:border-warm-gray-light"
              }`}
              title={name}
            >
              <Icon size={13} />
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-warm-gray-light/30">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-warm-gray hover:text-soft-brown transition-colors"
        >
          discard
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-xl text-sm font-medium text-white transition-colors shadow-warm-sm"
          style={{ backgroundColor: sealColor }}
        >
          {isEditing ? "Update Letter" : "Seal & Plant 📮"}
        </button>
      </div>
    </form>
  );
}
