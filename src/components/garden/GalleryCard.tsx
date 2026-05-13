"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { SECTION_META } from "@/lib/constants";
import { timeAgo, getDormancyStatus } from "@/lib/utils";
import { getIcon } from "@/components/ui/IconPicker";
import Badge from "@/components/ui/Badge";

interface GalleryCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  index: number;
}

export default function GalleryCard({ project, onEdit, index }: GalleryCardProps) {
  const Icon = project.icon ? getIcon(project.icon) : null;
  const dormancy = getDormancyStatus(project.lastTouchedAt);
  const sectionMeta = SECTION_META[project.section];

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.03 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onEdit(project)}
      className="relative w-full text-left bg-white/60 backdrop-blur-sm rounded-2xl border border-warm-gray-light/20
        shadow-warm-sm hover:shadow-warm p-4 transition-shadow duration-300 overflow-hidden"
    >
      {/* Accent stripe */}
      {project.color && (
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ backgroundColor: project.color }}
        />
      )}

      <div className="space-y-2" style={{ marginTop: project.color ? "4px" : undefined }}>
        {/* Icon + title */}
        <div className="flex items-start gap-2">
          {Icon && (
            <Icon
              size={16}
              className="shrink-0 mt-0.5"
              style={{ color: project.color || "#6B5B4E" }}
            />
          )}
          <h3 className="font-medium text-soft-brown text-sm leading-snug line-clamp-2">
            {project.title}
          </h3>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs text-warm-gray line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Next tiny step */}
        {project.nextTinyStep && (
          <p className="text-xs font-accent text-terracotta italic line-clamp-1">
            → {project.nextTinyStep}
          </p>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} color={project.color}>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium`}
            style={{
              backgroundColor: project.color ? `${project.color}22` : undefined,
              color: project.color || undefined,
            }}
          >
            {sectionMeta.label}
          </span>
          <div className="flex items-center gap-1.5">
            {dormancy && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  dormancy.level === "alert"
                    ? "bg-terracotta/10 text-terracotta"
                    : "bg-muted-gold/15 text-muted-gold"
                }`}
              >
                {dormancy.label}
              </span>
            )}
            <span className="text-[10px] text-warm-gray">{timeAgo(project.lastTouchedAt)}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
