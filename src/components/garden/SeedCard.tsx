"use client";

import { motion } from "framer-motion";
import { GripVertical, Sprout, ArrowUp, Trash2 } from "lucide-react";
import type { Project } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface SeedCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onGrow: (id: string) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
}

export default function SeedCard({
  project,
  onEdit,
  onGrow,
  onDelete,
  isDragging,
  dragHandleProps,
}: SeedCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isDragging ? 0.8 : 1,
        scale: isDragging ? 1.03 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={isDragging ? undefined : { scale: 1.02 }}
    >
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-sage/20 p-3 shadow-warm-sm hover:shadow-warm transition-shadow duration-300">
        <div className="flex items-center gap-2">
          <button
            className="text-warm-gray hover:text-soft-brown cursor-grab active:cursor-grabbing shrink-0"
            aria-label="Drag to reorder"
            {...dragHandleProps}
          >
            <GripVertical size={14} />
          </button>

          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => onEdit(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onEdit(project);
              }
            }}
          >
            <div className="flex items-center gap-1.5">
              <Sprout size={14} className="text-sage shrink-0" />
              <span className="font-medium text-sm text-soft-brown truncate">
                {project.title}
              </span>
            </div>
            {project.description && (
              <p className="text-xs text-warm-gray mt-0.5 truncate pl-5">
                {project.description}
              </p>
            )}
            {project.tags.length > 0 && (
              <div className="flex gap-1 mt-1.5 pl-5">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onGrow(project.id)}
              className="p-1 rounded-lg text-sage hover:text-sage-dark hover:bg-sage/10 transition-colors"
              aria-label="Grow into a project"
              title="Grow into a project"
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-1 rounded-lg text-warm-gray hover:text-terracotta hover:bg-terracotta/10 transition-colors"
              aria-label="Delete seed"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
