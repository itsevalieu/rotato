"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SECTION_META, SECTION_ORDER, PALETTE_COLORS, ICON_OPTIONS } from "@/lib/constants";
import { getIcon } from "@/components/ui/IconPicker";
import type { FormStyleProps } from "./types";

const inputClass =
  "w-full px-3 py-2 rounded-xl border border-warm-gray-light/60 bg-white/60 text-sm text-soft-brown placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-terracotta-light/50 transition-colors";

export default function TwoBeatForm({
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
  const [step, setStep] = useState(0);

  return (
    <form onSubmit={onSubmit}>
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            step === 0 ? "w-6 bg-terracotta" : "w-2 bg-warm-gray-light"
          }`}
        />
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            step === 1 ? "w-6 bg-terracotta" : "w-2 bg-warm-gray-light"
          }`}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="py-4 space-y-5">
              <p className="text-center text-warm-gray text-sm">
                {isEditing ? "What are you working on?" : "What are you planting?"}
              </p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="your project name..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (title.trim()) setStep(1);
                  }
                }}
                className="w-full text-3xl font-accent text-center text-soft-brown bg-transparent border-0 border-b-2 border-warm-gray-light focus:border-terracotta pb-3 placeholder:text-warm-gray focus:outline-none transition-colors"
              />
              <p className="text-center text-xs text-warm-gray">
                press enter or click next to continue
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-warm-gray hover:text-soft-brown transition-colors"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={() => { if (title.trim()) setStep(1); }}
                disabled={!title.trim()}
                className="flex items-center gap-1.5 px-5 py-2 bg-terracotta text-cream rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors shadow-warm-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-3.5"
          >
            {/* Section */}
            <div>
              <p className="text-xs text-warm-gray uppercase tracking-widest mb-2 font-medium">
                Where does it live?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SECTION_ORDER.map((s) => {
                  const Icon = getIcon(SECTION_META[s].icon);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSection(s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all border ${
                        section === s
                          ? "bg-parchment border-soft-brown text-soft-brown font-medium"
                          : "border-warm-gray-light/60 text-warm-gray hover:border-warm-gray hover:text-soft-brown"
                      }`}
                    >
                      {Icon && <Icon size={13} />}
                      {SECTION_META[s].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A few words about this project..."
              rows={2}
              className={`${inputClass} resize-none`}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={nextTinyStep}
                onChange={(e) => setNextTinyStep(e.target.value)}
                placeholder="Next tiny step..."
                className={inputClass}
              />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags..."
                className={inputClass}
              />
            </div>

            <input
              type="text"
              value={inspirationText}
              onChange={(e) => setInspirationText(e.target.value)}
              placeholder="Inspired by... a feeling, a reference, a moment"
              className={inputClass}
            />

            {/* Colour + icon */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
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
              <span className="text-warm-gray/50 mx-0.5 text-xs">|</span>
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
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex items-center gap-1 text-sm text-warm-gray hover:text-soft-brown transition-colors"
              >
                <ChevronLeft size={15} /> Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-terracotta text-cream rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors shadow-warm-sm"
              >
                {isEditing ? "Save Changes" : "Plant It 🌱"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
