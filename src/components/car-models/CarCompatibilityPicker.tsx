"use client";

import { useState } from "react";
import type { carModel } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type CarModel = InferSelectModel<typeof carModel>;

interface Props {
  allModels: CarModel[];
  selectedIds?: string[];
  name?: string; // form field name, default "carModelIds"
}

// Groups models by brand for a cleaner UX
function groupByBrand(models: CarModel[]) {
  return models.reduce<Record<string, CarModel[]>>((acc, m) => {
    (acc[m.brand] ??= []).push(m);
    return acc;
  }, {});
}

export function CarCompatibilityPicker({
  allModels,
  selectedIds = [],
  name = "carModelIds",
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));
  const [search, setSearch] = useState("");

  const filtered = search
    ? allModels.filter(
      (m) =>
        m.brand.toLowerCase().includes(search.toLowerCase()) ||
        m.model.toLowerCase().includes(search.toLowerCase()) ||
        m.generation?.toLowerCase().includes(search.toLowerCase())
    )
    : allModels;

  const grouped = groupByBrand(filtered);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Compatible Car Models</label>
        <span className="text-xs text-gray-500">{selected.size} selected</span>
      </div>

      <input
        type="text"
        placeholder="Search brand or model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm"
      />

      <div className="border rounded-lg max-h-64 overflow-y-auto divide-y">
        {Object.entries(grouped).map(([brand, models]) => (
          <div key={brand}>
            <div className="px-3 py-1.5 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {brand}
            </div>
            {models.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.has(m.id)}
                  onChange={() => toggle(m.id)}
                  className="rounded"
                />
                <span className="text-sm">
                  {m.model}
                  {m.generation && (
                    <span className="text-gray-400"> · {m.generation}</span>
                  )}
                  {(m.yearFrom || m.yearTo) && (
                    <span className="text-gray-400">
                      {" "}
                      ({m.yearFrom ?? "?"}–{m.yearTo ?? "present"})
                    </span>
                  )}
                </span>
                {m.isPopular && (
                  <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                    Popular
                  </span>
                )}
              </label>
            ))}
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="px-3 py-4 text-sm text-gray-400 text-center">No models found</p>
        )}
      </div>

      {/* Hidden inputs to submit selected IDs with the form */}
      {Array.from(selected).map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}
    </div>
  );
}
