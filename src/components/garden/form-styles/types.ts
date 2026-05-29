import type { SectionId } from "@/lib/types";

export interface FormStyleProps {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  inspirationText: string;
  setInspirationText: (v: string) => void;
  tags: string;
  setTags: (v: string) => void;
  nextTinyStep: string;
  setNextTinyStep: (v: string) => void;
  color: string | undefined;
  setColor: (v: string | undefined) => void;
  icon: string | undefined;
  setIcon: (v: string | undefined) => void;
  section: SectionId;
  setSection: (v: SectionId) => void;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}
