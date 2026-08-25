"use server";
import { pageRepository } from "../repositories/page/pageRepository";
import { pageSchemas, type PageKey, type PageData } from "@/lib/types/pages";

export async function getPageContent<K extends PageKey>(pageKey: K) {
  const page = await pageRepository.findByKey(pageKey);
  if (!page) return null;

  const parsed = pageSchemas[pageKey].safeParse(page.content);
  if (!parsed.success) {
    console.error(`Invalid content for page "${pageKey}"`, parsed.error);
    return null; // caller falls back to defaults
  }

  return { ...page, content: parsed.data as PageData<K> };
}

export async function savePageContent<K extends PageKey>(
  pageKey: K,
  data: { title?: string; content: PageData<K> },
) {
  pageSchemas[pageKey].parse(data.content); // throws on bad shape
  return pageRepository.upsert(pageKey, data);
}

export async function deletePageContent(pageKey: PageKey) {
  return pageRepository.deleteByKey(pageKey);
}
