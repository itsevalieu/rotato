"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Send } from "lucide-react";
import { nanoid } from "nanoid";
import { useGarden } from "@/context/GardenContext";
import type { Project, JournalEntry } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface ProjectJournalProps {
  project: Project;
}

const WEATHER_EMOJI: Record<string, string> = {
  sunny: "☀️",
  breezy: "🌬️",
  "cozy-rain": "🌧️",
  foggy: "🌫️",
  starry: "✨",
};

export default function ProjectJournal({ project }: ProjectJournalProps) {
  const { state, dispatch } = useGarden();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const entry: JournalEntry = {
      id: nanoid(),
      text: trimmed,
      createdAt: new Date().toISOString(),
      mood: state.creativeWeather,
    };
    dispatch({ type: "ADD_JOURNAL_ENTRY", id: project.id, entry });
    setText("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const entries = project.journalEntries ?? [];

  return (
    <div className="mt-3 border-t border-warm-gray-light/20 pt-3 space-y-3">
      <p className="text-xs font-medium text-warm-gray flex items-center gap-1.5">
        <BookOpen size={12} />
        Captain&apos;s Log
        {entries.length > 0 && (
          <span className="bg-parchment rounded-full px-1.5 py-0.5 text-[10px]">
            {entries.length}
          </span>
        )}
      </p>

      {/* Quick-add */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Log a thought… ⌘↵ to save"
          rows={2}
          className="flex-1 text-sm bg-white/60 border border-warm-gray-light/30 rounded-xl px-3 py-2
            text-soft-brown placeholder:text-warm-gray/50 resize-none focus:outline-none
            focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/40 transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2 rounded-xl bg-terracotta text-cream disabled:opacity-30 disabled:cursor-not-allowed
            hover:bg-terracotta/90 transition-colors shrink-0"
          aria-label="Save log entry"
        >
          <Send size={14} />
        </button>
      </form>

      {/* Entry list */}
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i === 0 ? 0 : i * 0.04, type: "spring", stiffness: 300, damping: 28 }}
            className="group bg-white/40 rounded-xl px-3 py-2.5 space-y-1"
          >
            <p className="text-sm text-soft-brown leading-relaxed whitespace-pre-wrap">
              {entry.text}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-warm-gray">
              <time
                dateTime={entry.createdAt}
                title={new Date(entry.createdAt).toLocaleString()}
              >
                {timeAgo(entry.createdAt)}
              </time>
              {entry.mood && (
                <span title={entry.mood}>{WEATHER_EMOJI[entry.mood]}</span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {entries.length === 0 && (
        <p className="text-xs text-warm-gray/60 italic text-center py-1 font-accent">
          No entries yet. How&apos;s it going?
        </p>
      )}
    </div>
  );
}
