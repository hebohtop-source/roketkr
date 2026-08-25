"use client";
import { useState } from "react";
import { savePageContent } from "@/lib/services/pageService";
import type { AboutPageData, AboutSection } from "@/lib/types/pages";
import ImageUploadField from "@/components/ImageUploadField";

const sectionLabels: Record<AboutSection["id"], string> = {
  "who-we-are": "Кто мы",
  approach: "Наш подход",
  section3: "Секция 3",
};

export default function AboutPageEditor({
  initialData,
}: {
  initialData: AboutPageData;
}) {
  const [data, setData] = useState<AboutPageData>(initialData);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateSection = (
    id: AboutSection["id"],
    patch: Partial<AboutSection>,
  ) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await savePageContent("about", { title: data.meta.title, content: data });
      setSavedAt(new Date());
    } catch (err) {
      setError("Failed to save. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-6">
      <fieldset className="space-y-2 border-b pb-6">
        <legend className="mb-2 font-semibold">SEO / Meta</legend>
        <input
          value={data.meta.title}
          onChange={(e) =>
            setData((p) => ({
              ...p,
              meta: { ...p.meta, title: e.target.value },
            }))
          }
          placeholder="Page title"
          className="w-full rounded border p-2"
        />
        <textarea
          value={data.meta.description}
          onChange={(e) =>
            setData((p) => ({
              ...p,
              meta: { ...p.meta, description: e.target.value },
            }))
          }
          placeholder="Meta description"
          rows={2}
          className="w-full rounded border p-2"
        />
      </fieldset>

      {data.sections.map((section) => (
        <fieldset key={section.id} className="space-y-3 border-b pb-6">
          <legend className="mb-2 font-semibold">
            {sectionLabels[section.id]}
          </legend>

          <ImageUploadField
            label="Image"
            value={section.image}
            onChange={(url) => updateSection(section.id, { image: url })}
          />

          <input
            value={section.heading}
            onChange={(e) =>
              updateSection(section.id, { heading: e.target.value })
            }
            placeholder="Heading"
            className="w-full rounded border p-2 font-semibold"
          />

          <textarea
            value={section.text}
            onChange={(e) =>
              updateSection(section.id, { text: e.target.value })
            }
            placeholder="Text"
            rows={5}
            className="w-full rounded border p-2"
          />
        </fieldset>
      ))}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save page"}
        </button>
        {savedAt && (
          <span className="text-sm text-gray-500">
            Saved at {savedAt.toLocaleTimeString()}
          </span>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}
