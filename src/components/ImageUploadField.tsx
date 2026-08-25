"use client";
import { useState } from "react";

export default function ImageUploadField({
  value,
  onChange,
  label,
  folder,
}: {
  value: string;
  onChange: (filename: string) => void;
  label?: string;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (folder) fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { filename } = await res.json();
      onChange(filename);
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-gray-600">{label}</p>}
      {value && (
        <img
          src={`/uploads/${value}`}
          alt=""
          className="h-32 w-32 rounded object-cover"
        />
      )}
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {uploading && <span className="text-sm text-gray-500">Uploading…</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
