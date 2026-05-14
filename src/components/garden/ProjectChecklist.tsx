"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useGarden } from "@/context/GardenContext";
import type { Project } from "@/lib/types";

interface ProjectChecklistProps {
  project: Project;
  hideHeader?: boolean;
}

export default function ProjectChecklist({ project, hideHeader = false }: ProjectChecklistProps) {
  const { dispatch } = useGarden();
  const [newText, setNewText] = useState("");

  const items = project.checklistItems ?? [];
  const done = items.filter((i) => i.done).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    dispatch({
      type: "ADD_CHECKLIST_ITEM",
      projectId: project.id,
      item: { id: nanoid(), text, done: false },
    });
    setNewText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd(e as unknown as React.FormEvent);
  };

  return (
    <div className="mt-3 border-t border-warm-gray-light/20 pt-3 space-y-2">
      {!hideHeader && (
        <p className="text-xs font-medium text-warm-gray flex items-center gap-1.5">
          <CheckSquare size={12} />
          Milestones
          {items.length > 0 && (
            <span className="bg-parchment rounded-full px-1.5 py-0.5 text-[10px]">
              {done}/{items.length}
            </span>
          )}
        </p>
      )}

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="h-1 bg-warm-gray-light/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-sage rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(done / items.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      )}

      {/* Items */}
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            className="group/item flex items-center gap-2"
          >
            <button
              onClick={() =>
                dispatch({
                  type: "TOGGLE_CHECKLIST_ITEM",
                  projectId: project.id,
                  itemId: item.id,
                })
              }
              className="shrink-0 w-4 h-4 rounded border border-warm-gray-light/40 flex items-center justify-center
                hover:border-sage transition-colors"
              style={item.done ? { backgroundColor: "var(--color-sage)", borderColor: "var(--color-sage)" } : undefined}
              aria-label={item.done ? "Mark incomplete" : "Mark complete"}
            >
              {item.done && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span
              className={`flex-1 text-sm transition-colors ${
                item.done ? "line-through text-warm-gray/50" : "text-soft-brown"
              }`}
            >
              {item.text}
            </span>
            <button
              onClick={() =>
                dispatch({
                  type: "DELETE_CHECKLIST_ITEM",
                  projectId: project.id,
                  itemId: item.id,
                })
              }
              className="opacity-0 group-hover/item:opacity-100 p-0.5 rounded text-warm-gray
                hover:text-terracotta transition-all"
              aria-label="Delete milestone"
            >
              <Trash2 size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add new */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a milestone…"
          className="flex-1 text-sm bg-white/60 dark:bg-white/[0.06] border border-warm-gray-light/30 rounded-lg px-2.5 py-1.5
            text-soft-brown placeholder:text-warm-gray/70 focus:outline-none focus:ring-2
            focus:ring-sage/30 focus:border-sage/40 transition-all"
        />
        <button
          type="submit"
          disabled={!newText.trim()}
          className="p-1.5 rounded-lg bg-sage/80 text-cream disabled:opacity-30 disabled:cursor-not-allowed
            hover:bg-sage transition-colors shrink-0"
          aria-label="Add milestone"
        >
          <Plus size={14} />
        </button>
      </form>
    </div>
  );
}
