"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useGarden } from "@/context/GardenContext";
import { useToast } from "@/context/ToastContext";
import type { Project, SectionId } from "@/lib/types";
import FormStylePicker from "./FormStylePicker";
import ClassicForm from "./form-styles/ClassicForm";
import SentenceForm from "./form-styles/SentenceForm";
import SeedPacketForm from "./form-styles/SeedPacketForm";
import TwoBeatForm from "./form-styles/TwoBeatForm";
import EnvelopeForm from "./form-styles/EnvelopeForm";
import LivePreviewForm from "./form-styles/LivePreviewForm";
import type { FormStyleProps } from "./form-styles/types";

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
  defaultSection?: SectionId;
}

export default function ProjectForm({
  open,
  onClose,
  project,
  defaultSection = "currently-playing",
}: ProjectFormProps) {
  const { dispatch, createProject, state } = useGarden();
  const { showToast } = useToast();
  const isEditing = !!project;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inspirationText, setInspirationText] = useState("");
  const [tags, setTags] = useState("");
  const [nextTinyStep, setNextTinyStep] = useState("");
  const [color, setColor] = useState<string | undefined>();
  const [icon, setIcon] = useState<string | undefined>();
  const [section, setSection] = useState<SectionId>(defaultSection);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setInspirationText(project.inspirationText || "");
      setTags(project.tags.join(", "));
      setNextTinyStep(project.nextTinyStep || "");
      setColor(project.color);
      setIcon(project.icon);
      setSection(project.section);
    } else {
      setTitle("");
      setDescription("");
      setInspirationText("");
      setTags("");
      setNextTinyStep("");
      setColor(undefined);
      setIcon(undefined);
      setSection(defaultSection);
    }
  }, [project, defaultSection, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (isEditing && project) {
      const newStep = nextTinyStep.trim() || undefined;
      const stepChanged = newStep && newStep !== project.nextTinyStep;
      dispatch({
        type: "UPDATE_PROJECT",
        project: {
          ...project,
          title: title.trim(),
          description: description.trim(),
          inspirationText: inspirationText.trim() || undefined,
          tags: parsedTags,
          nextTinyStep: newStep,
          color,
          icon,
          section,
        },
      });
      if (stepChanged) showToast("Next tiny step set — you've got this 🌱", "✓");
    } else {
      createProject({
        title: title.trim(),
        description: description.trim(),
        inspirationText: inspirationText.trim() || undefined,
        tags: parsedTags,
        nextTinyStep: nextTinyStep.trim() || undefined,
        color,
        icon,
        section,
        journalEntries: [],
        checklistItems: [],
      });
    }

    onClose();
  };

  const formStyle = state.formStyle ?? "classic";
  const isLivePreview = formStyle === "live-preview";

  // Classic and Two-beat have their own title in the modal header area
  const modalTitle =
    formStyle === "classic" || formStyle === "two-beat"
      ? isEditing
        ? "Edit Project"
        : "Plant Something New"
      : undefined;

  const formProps: FormStyleProps = {
    title,
    setTitle,
    description,
    setDescription,
    inspirationText,
    setInspirationText,
    tags,
    setTags,
    nextTinyStep,
    setNextTinyStep,
    color,
    setColor,
    icon,
    setIcon,
    section,
    setSection,
    isEditing,
    onSubmit: handleSubmit,
    onClose,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalTitle}
      headerAction={<FormStylePicker />}
      size={isLivePreview ? "lg" : "md"}
    >
      {formStyle === "classic" && <ClassicForm {...formProps} />}
      {formStyle === "sentence" && <SentenceForm {...formProps} />}
      {formStyle === "seed-packet" && <SeedPacketForm {...formProps} />}
      {formStyle === "two-beat" && <TwoBeatForm {...formProps} />}
      {formStyle === "envelope" && <EnvelopeForm {...formProps} />}
      {formStyle === "live-preview" && <LivePreviewForm {...formProps} />}
    </Modal>
  );
}
