import Link from "next/link";
import { PAGES } from "@/lib/constants/pages";

export default function PagesIndex() {
  return (
    <div className="mx-auto max-w-2xl py-6">
      <h1 className="mb-4 text-xl font-semibold">Страницы</h1>
      <ul className="divide-y rounded border">
        {PAGES.map((page) => (
          <li key={page.key}>
            <Link
              href={`/admin/pages/${page.key}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <span>{page.label}</span>
              <span className="text-sm text-gray-400">{page.href}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
