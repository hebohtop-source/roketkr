import { db } from "@/db";

import {
  carModel,
  category,
  product,
  productCarCompatibility,
  productImage,
  productTag,
  productPromotion,
  tag,
  promotion,
  orderItem,
} from "@/db/schema";

import {
  isNotNull,
  isNull,
  SQL,
  like,
  eq,
  lte,
  gte,
  and,
  or,
  inArray,
  sql,
  asc,
  desc,
} from "drizzle-orm";

export type Tag = typeof tag.$inferSelect;
export type Category = typeof category.$inferSelect;
export type Product = typeof product.$inferSelect;
export type ProductImage = typeof productImage.$inferSelect;
export type Promotion = {
  id: string;
  name: string;
  productId: string;
  discountPercent: string | null;
  discountAmount: string | null;
};

export type ResolvedProduct = {
  id: string;
  name: string;
  slug: string;
  price: string;
  isActive: boolean;
  brand: string | null;
  tags: Tag[];
  primaryImage: ProductImage | null;
  category: { slug: string } | null;
  stockQty: number;
};

export type FilterParams = {
  name?: string;
  sku?: string;
  categoryId?: string;
  categories?: string[];
  tags?: string[];
  promotions?: string[];
  hasPromotion?: boolean;
  brand?: string;
  model?: string;
  orderBy?: "BY_POPULARITY" | "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC";
  priceMax?: string;
  priceMin?: string;
  limit?: number;
  offset?: number;
};

export type FilterResult = {
  products: ResolvedProduct[];
  total: number;
};

// Order count is a correlated subquery, not a join, so it stays
// compatible with a plain `db.select()` and doesn't affect row
// multiplicity. Counts orderItem rows in ANY order status, per
// product request.
//
// NOTE: this must NOT be passed as the `orderBy` of
// `db.query.product.findMany(...)` when that query also has a
// `with` for a to-many relation + limit/offset. Drizzle's relational
// query builder (RQB) rewrites table aliases for the lateral joins it
// builds in that case, and it will mis-alias raw `sql` fragments that
// reference a *different* table than the one being queried (here,
// `orderItem`), producing SQL like:
//
//   where `product`.`productId` = `product`.`id`
//
// ...i.e. it silently rewrites `orderItem.productId` to the `product`
// alias too, which then fails with "Unknown column 'product.productId'".
// Keeping this subquery attached to a plain `db.select()` (see
// `filterProducts` below) avoids RQB's alias-rewrite pass entirely.
function resolveOrderBy(orderBy: FilterParams["orderBy"]) {
  switch (orderBy) {
    case "PRICE_ASC":
      return [asc(product.price)];
    case "PRICE_DESC":
      return [desc(product.price)];
    case "NAME_ASC":
      return [asc(product.name)];
    case "BY_POPULARITY":
    default:
      return [
        desc(sql`(
          select count(*)
          from ${orderItem}
          where ${orderItem.productId} = ${product.id}
        )`),
      ];
  }
}

export const filterRepository = {
  async filterProducts({
    name,
    sku,
    categoryId,
    categories,
    tags,
    hasPromotion,
    brand,
    model,
    orderBy = "BY_POPULARITY",
    priceMax,
    priceMin,
    limit = 48,
    offset = 0,
  }: FilterParams): Promise<FilterResult> {
    const now = new Date();
    const filters: SQL[] = [eq(product.isActive, true)];

    if (name) filters.push(like(product.name, `%${name}%`));
    if (sku) filters.push(like(product.sku, `%${sku}%`));

    if (categoryId) filters.push(eq(product.categoryId, categoryId));

    if (categories && categories.length > 0) {
      filters.push(
        inArray(
          product.categoryId,
          db
            .select({ id: category.id })
            .from(category)
            .where(inArray(category.slug, categories)),
        ),
      );
    }

    if (brand) filters.push(like(product.brand, `%${brand}%`));
    if (priceMin) filters.push(gte(product.price, priceMin));
    if (priceMax) filters.push(lte(product.price, priceMax));

    if (model) {
      filters.push(
        inArray(
          product.id,
          db
            .select({ productId: productCarCompatibility.productId })
            .from(productCarCompatibility)
            .innerJoin(
              carModel,
              eq(carModel.id, productCarCompatibility.carModelId),
            )
            .where(eq(carModel.slug, model)),
        ),
      );
    }

    if (tags && tags.length > 0) {
      filters.push(
        inArray(
          product.id,
          db
            .select({ productId: productTag.productId })
            .from(productTag)
            .innerJoin(tag, eq(tag.id, productTag.tagId))
            .where(inArray(tag.slug, tags))
            .groupBy(productTag.productId)
            .having(sql`count(distinct ${tag.slug}) = ${tags.length}`),
        ),
      );
    }

    if (hasPromotion) {
      filters.push(
        inArray(
          product.id,
          db
            .select({ productId: productPromotion.productId })
            .from(productPromotion)
            .innerJoin(
              promotion,
              eq(promotion.id, productPromotion.promotionId),
            )
            .where(
              and(
                eq(promotion.isActive, true),
                or(isNull(promotion.startsAt), lte(promotion.startsAt, now)),
                or(isNull(promotion.endsAt), gte(promotion.endsAt, now)),
              ),
            ),
        ),
      );
    }

    // Step 1: resolve which ids belong on this page, and in what order,
    // using a plain select. This is where the popularity/orderBy sql
    // lives; no RQB aliasing involved, so `orderItem.productId` resolves
    // correctly.
    const [idRows, [{ count }]] = await Promise.all([
      db
        .select({ id: product.id })
        .from(product)
        .where(and(...filters))
        .orderBy(...resolveOrderBy(orderBy))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(product)
        .where(and(...filters)),
    ]);

    const ids = idRows.map((r) => r.id);

    if (ids.length === 0) {
      return { products: [], total: Number(count) };
    }

    // Step 2: hydrate the relational shape (images, category) for just
    // this page of ids. No orderBy/limit/offset here, so RQB doesn't need
    // to do the subquery-wrapping that triggered the aliasing bug.
    const rows = await db.query.product.findMany({
      where: inArray(product.id, ids),
      columns: {
        id: true,
        name: true,
        brand: true,
        slug: true,
        price: true,
        isActive: true,
        stockQty: true,
      },
      with: {
        images: {
          where: eq(productImage.isPrimary, true),
          limit: 1,
        },
        category: {
          columns: { slug: true },
        },
      },
    });

    // findMany(inArray(...)) does not preserve the order of `ids`, so
    // reapply the order/pagination already computed in step 1.
    const byId = new Map(rows.map((row) => [row.id, row]));
    const ordered = ids
      .map((id) => byId.get(id))
      .filter((row): row is (typeof rows)[number] => row !== undefined);

    return {
      products: ordered.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        price: row.price,
        isActive: row.isActive,
        brand: row.brand,
        stockQty: row.stockQty,
        tags: [],
        primaryImage: row.images[0] ?? null,
        category: row.category,
      })),
      total: Number(count),
    };
  },

  getTags: () => db.query.tag.findMany(),
  getModels: () => db.query.carModel.findMany(),
  getActiveCategories: () =>
    db.query.category.findMany({
      where: eq(category.isActive, true),
    }),

  getBrands: () =>
    db
      .selectDistinct({ id: product.brand, name: product.brand })
      .from(product)
      .where(isNotNull(product.brand)),

  getActivePromotions: (): Promise<Promotion[]> => {
    const now = new Date();
    return db
      .selectDistinct({
        id: promotion.id,
        name: promotion.name,
        productId: productPromotion.productId,
        discountPercent: promotion.discountPercent,
        discountAmount: promotion.discountAmount,
      })
      .from(promotion)
      .innerJoin(
        productPromotion,
        eq(productPromotion.promotionId, promotion.id),
      )
      .where(
        and(
          eq(promotion.isActive, true),
          or(isNull(promotion.startsAt), lte(promotion.startsAt, now)),
          or(isNull(promotion.endsAt), gte(promotion.endsAt, now)),
        ),
      );
  },
};
