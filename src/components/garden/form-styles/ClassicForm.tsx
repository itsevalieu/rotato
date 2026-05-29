"use client";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import ColorPicker from "@/components/ui/ColorPicker";
import IconPicker from "@/components/ui/IconPicker";
import { SECTION_META, SECTION_ORDER } from "@/lib/constants";
import type { FormStyleProps } from "./types";

export default function ClassicForm({
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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        id="title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What are you creating?"
        required
        autoFocus
      />
      <Textarea
        id="description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="A few words about this project..."
        rows={2}
      />
      <Textarea
        id="inspiration"
        label="Inspiration / Mood"
        value={inspirationText}
        onChange={(e) => setInspirationText(e.target.value)}
        placeholder="What inspired this? A feeling, a reference, a moment..."
        rows={2}
      />
      <Input
        id="tags"
        label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="art, watercolor, daily-practice"
      />
      <Input
        id="nextTinyStep"
        label="Next Tiny Step"
        value={nextTinyStep}
        onChange={(e) => setNextTinyStep(e.target.value)}
        placeholder="The smallest possible next action..."
      />
      <div>
        <label className="block text-sm font-medium text-soft-brown mb-1.5">Section</label>
        <div className="flex flex-wrap gap-2">
          {SECTION_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`px-3 py-1.5 rounded-xl text-sm transition-all duration-200 border ${
                section === s
                  ? "bg-parchment border-soft-brown text-soft-brown font-medium"
                  : "border-warm-gray-light/50 text-warm-gray hover:border-warm-gray"
              }`}
            >
              {SECTION_META[s].label}
            </button>
          ))}
        </div>
      </div>
      <ColorPicker value={color} onChange={setColor} />
      <IconPicker value={icon} onChange={setIcon} />
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1">
          {isEditing ? "Save Changes" : "Plant It"}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
