export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { product, category } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// Proper CSV line parser — handles quoted fields with commas inside
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Файл превышает 5MB" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV пустой или содержит только заголовок" },
        { status: 400 }
      );
    }

    const headers = parseCSVLine(lines[0]);

    const required = [
      "name",
      "sku",
      "slug",
      "price",
      "categorySlug",
      "categoryName",
    ];

    for (const field of required) {
      if (!headers.includes(field)) {
        return NextResponse.json(
          { error: `Отсутствует обязательная колонка: ${field}` },
          { status: 400 }
        );
      }
    }

    const rows = lines.slice(1);

    const errors: string[] = [];
    const warnings: string[] = [];

    let successful = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {
      const rowNum = i + 2;
      const values = parseCSVLine(rows[i]);
      const row: Record<string, string> = {};

      headers.forEach((h, idx) => {
        row[h] = (values[idx] ?? "").trim();
      });

      if (!row.name || !row.sku || !row.slug || !row.price || !row.categorySlug || !row.categoryName) {
        errors.push(`Строка ${rowNum}: отсутствуют обязательные поля`);
        failed++;
        continue;
      }

      const price = parseFloat(row.price);

      if (isNaN(price) || price < 0) {
        errors.push(`Строка ${rowNum}: некорректный price "${row.price}"`);
        failed++;
        continue;
      }

      // CATEGORY: find or create using CSV name
      let categoryId: string;

      const existingCategory = await db
        .select({ id: category.id })
        .from(category)
        .where(eq(category.slug, row.categorySlug))
        .limit(1);

      if (existingCategory.length > 0) {
        categoryId = existingCategory[0].id;
      } else {
        const id = randomUUID();

        await db.insert(category).values({
          id,
          slug: row.categorySlug,
          name: row.categoryName,
        });

        categoryId = id;
      }

      const compareAtPrice = row.compareAtPrice
        ? parseFloat(row.compareAtPrice)
        : null;

      const condition = row.condition as
        | "new"
        | "used"
        | "refurbished"
        | undefined;

      const weight = row.weight ? parseFloat(row.weight) : null;

      try {
        await db.insert(product).values({
          id: randomUUID(),
          name: row.name,
          sku: row.sku,
          slug: row.slug,
          price: String(price),
          compareAtPrice: compareAtPrice !== null ? String(compareAtPrice) : null,
          brand: row.brand || null,
          model: row.model || null,
          generation: row.generation || null,
          description: row.description || null,
          stockQty: row.stockQty ? parseInt(row.stockQty) : 0,
          condition: condition ?? "new",
          isActive: row.isActive === "false" ? false : true,
          isFeatured: row.isFeatured === "true" ? true : false,
          categoryId,
          weight: weight !== null ? String(weight) : null,
          metaTitle: row.metaTitle || null,
          metaDescription: row.metaDescription || null,
        });

        successful++;
      } catch (err: any) {
        const msg =
          err?.cause?.message ||
          err?.sqlMessage ||
          err?.message ||
          JSON.stringify(err);

        errors.push(`Строка ${rowNum}: ${msg}`);
        failed++;
      }
    }

    return NextResponse.json({
      message: `Обработано ${rows.length} строк: ${successful} успешно, ${failed} с ошибками`,
      details: {
        processed: rows.length,
        successful,
        failed,
        errors: errors.length ? errors : undefined,
        warnings: warnings.length ? warnings : undefined,
      },
    });
  } catch (err: any) {
    console.error("Bulk upload error:", err);

    return NextResponse.json(
      {
        error: "Внутренняя ошибка сервера",
        details: {
          processed: 0,
          successful: 0,
          failed: 0,
        },
      },
      { status: 500 }
    );
  }
}
