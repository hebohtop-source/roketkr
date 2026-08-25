"use client";
import { useState } from "react";
import { savePageContent } from "@/lib/services/pageService";
import type { CertificatesPageData, CertificateItem } from "@/lib/types/pages";
import ImageUploadField from "@/components/ImageUploadField";

function makeId() {
  return crypto.randomUUID();
}

export default function CertificatesPageEditor({
  initialData,
}: {
  initialData: CertificatesPageData;
}) {
  const [data, setData] = useState<CertificatesPageData>(initialData);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateCert = (id: string, patch: Partial<CertificateItem>) => {
    setData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((c) =>
        c.id === id ? { ...c, ...patch } : c,
      ),
    }));
  };

  const addCert = () => {
    setData((prev) => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        { id: makeId(), url: "", altText: "" },
      ],
    }));
  };

  const removeCert = (id: string) => {
    setData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => c.id !== id),
    }));
  };

  const moveCert = (index: number, direction: -1 | 1) => {
    setData((prev) => {
      const next = [...prev.certificates];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, certificates: next };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await savePageContent("certificates", {
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
        <legend className="mb-2 font-semibold">Page heading</legend>
        <input
          value={data.pageHeading}
          onChange={(e) =>
            setData((p) => ({ ...p, pageHeading: e.target.value }))
          }
          placeholder="e.g. Сертификаты"
          className="w-full rounded border p-2 font-semibold"
        />
      </fieldset>

      <fieldset className="space-y-3 border-b pb-6">
        <legend className="mb-2 font-semibold">Intro</legend>
        <input
          value={data.intro.heading}
          onChange={(e) =>
            setData((p) => ({
              ...p,
              intro: { ...p.intro, heading: e.target.value },
            }))
          }
          placeholder="Heading"
          className="w-full rounded border p-2 font-semibold"
        />
        <textarea
          value={data.intro.text}
          onChange={(e) =>
            setData((p) => ({
              ...p,
              intro: { ...p.intro, text: e.target.value },
            }))
          }
          placeholder="Text"
          rows={6}
          className="w-full rounded border p-2"
        />
      </fieldset>

      <fieldset className="space-y-4 pb-2">
        <div className="flex items-center justify-between">
          <legend className="font-semibold">Certificates</legend>
          <button
            type="button"
            onClick={addCert}
            className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
          >
            + Add certificate
          </button>
        </div>

        {data.certificates.map((cert, i) => (
          <div key={cert.id} className="space-y-2 rounded border p-3">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Certificate {i + 1}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moveCert(i, -1)}
                  disabled={i === 0}
                  className="disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveCert(i, 1)}
                  disabled={i === data.certificates.length - 1}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeCert(cert.id)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>

            <ImageUploadField
              value={cert.url}
              onChange={(url) => updateCert(cert.id, { url })}
            />
            <input
              value={cert.altText}
              onChange={(e) => updateCert(cert.id, { altText: e.target.value })}
              placeholder="Alt text / name"
              className="w-full rounded border p-2"
            />
          </div>
        ))}
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
