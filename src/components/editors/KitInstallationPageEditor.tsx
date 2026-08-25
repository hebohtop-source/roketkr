"use client";
import { useState } from "react";
import { savePageContent } from "@/lib/services/pageService";
import type {
  KitInstallationPageData,
  KitInstallationStep,
} from "@/lib/types/pages";
import VideoUploadField from "@/components/VideoUploadField";

export default function KitInstallationPageEditor({
  initialData,
}: {
  initialData: KitInstallationPageData;
}) {
  const [data, setData] = useState<KitInstallationPageData>(initialData);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStep = (
    id: KitInstallationStep["id"],
    patch: Partial<KitInstallationStep>,
  ) => {
    setData((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await savePageContent("kit-installation", {
        title: data.meta.title,
        content: data,
      });
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

      <fieldset className="space-y-2 border-b pb-6">
        <legend className="mb-2 font-semibold">Video</legend>
        <VideoUploadField
          value={data.videoUrl}
          onChange={(url) => setData((p) => ({ ...p, videoUrl: url }))}
        />
      </fieldset>

      <fieldset className="space-y-4 border-b pb-6">
        <legend className="mb-2 font-semibold">Steps section</legend>
        <input
          value={data.stepsHeading}
          onChange={(e) =>
            setData((p) => ({ ...p, stepsHeading: e.target.value }))
          }
          placeholder="Section heading"
          className="w-full rounded border p-2 font-semibold"
        />

        {data.steps.map((step, i) => (
          <div key={step.id} className="space-y-2 rounded border p-3">
            <p className="text-sm text-gray-500">Step {i + 1}</p>
            <input
              value={step.title}
              onChange={(e) => updateStep(step.id, { title: e.target.value })}
              placeholder="Step title"
              className="w-full rounded border p-2"
            />
            <textarea
              value={step.desc}
              onChange={(e) => updateStep(step.id, { desc: e.target.value })}
              placeholder="Step description"
              rows={3}
              className="w-full rounded border p-2"
            />
          </div>
        ))}
      </fieldset>

      <fieldset className="space-y-2 pb-2">
        <legend className="mb-2 font-semibold">Models section</legend>
        <input
          value={data.modelsHeading}
          onChange={(e) =>
            setData((p) => ({ ...p, modelsHeading: e.target.value }))
          }
          placeholder="Section heading"
          className="w-full rounded border p-2 font-semibold"
        />
        <p className="text-sm text-gray-500">
          The model cards themselves are managed in Catalog / Car Models, not
          here.
        </p>
      </fieldset>

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
