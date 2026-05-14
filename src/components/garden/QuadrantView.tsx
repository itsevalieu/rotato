"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { SECTION_ORDER, SECTION_META, SECTION_COLORS } from "@/lib/constants";
import { getProjectsBySection, timeAgo } from "@/lib/utils";
import type { Project, SectionId } from "@/lib/types";
import { getIcon } from "@/components/ui/IconPicker";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ProjectForm from "./ProjectForm";

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string }>;

function QuadrantCard({
  project,
  onEdit,
}: {
  project: Project;
  onEdit: (p: Project) => void;
}) {
  const accentColor = project.color ?? SECTION_COLORS[project.section];
  const Icon = project.icon ? getIcon(project.icon) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <Card accentColor={accentColor} className="p-3 cursor-pointer" onClick={() => onEdit(project)}>
        <div className="flex items-start gap-2">
          {Icon && <Icon size={14} className="shrink-0 mt-0.5" style={{ color: accentColor }} />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-soft-brown truncate">{project.title}</p>
            {project.nextTinyStep && (
              <p className="text-xs font-accent text-terracotta italic mt-0.5 line-clamp-1">
                {project.nextTinyStep}
              </p>
            )}
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {project.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} color={accentColor}>{tag}</Badge>
                ))}
                {project.tags.length > 2 && (
                  <span className="text-[10px] text-warm-gray">+{project.tags.length - 2}</span>
                )}
              </div>
            )}
            <p className="text-[10px] text-warm-gray mt-1">{timeAgo(project.lastTouchedAt)}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function QuadrantCell({
  sectionId,
  projects,
  onEdit,
}: {
  sectionId: SectionId;
  projects: Project[];
  onEdit: (p: Project) => void;
}) {
  const meta = SECTION_META[sectionId];
  const Icon = (LucideIcons as Record<string, unknown>)[meta.icon] as LucideIconComponent;
  const accentHex = SECTION_COLORS[sectionId];

  const textColorMap: Record<string, string> = {
    terracotta: "text-terracotta",
    "dusty-blue": "text-dusty-blue",
    sage: "text-sage",
    "muted-gold": "text-muted-gold",
  };

  const borderColorMap: Record<string, string> = {
    terracotta: "border-terracotta/20",
    "dusty-blue": "border-dusty-blue/20",
    sage: "border-sage/20",
    "muted-gold": "border-muted-gold/20",
  };

  return (
    <div
      className={`flex flex-col rounded-2xl border-2 ${borderColorMap[meta.color]} bg-white/30 dark:bg-white/[0.04] overflow-hidden`}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: `${accentHex}25` }}
      >
        {Icon && <Icon size={14} className={`${textColorMap[meta.color]} shrink-0`} />}
        <h3 className={`font-accent text-sm ${textColorMap[meta.color]} truncate flex-1`}>{meta.label}</h3>
        <span className="text-[10px] text-warm-gray bg-parchment px-1.5 py-0.5 rounded-full">{projects.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 min-h-[120px] sm:min-h-[80px]">
        {projects.map((p) => (
          <QuadrantCard key={p.id} project={p} onEdit={onEdit} />
        ))}
        {projects.length === 0 && (
          <p className="text-xs text-warm-gray/50 italic text-center pt-4 font-accent">{meta.emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

interface QuadrantViewProps {
  filtered: Project[];
}

export default function QuadrantView({ filtered }: QuadrantViewProps) {
  const { dispatch } = useGarden();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:h-[calc(100vh-10rem)]">
        {SECTION_ORDER.map((sectionId) => (
          <QuadrantCell
            key={sectionId}
            sectionId={sectionId}
            projects={getProjectsBySection(filtered, sectionId)}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <ProjectForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingProject(null); }}
        project={editingProject}
        defaultSection="currently-playing"
      />
    </>
  );
}
