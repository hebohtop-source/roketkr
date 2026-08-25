import {
  mysqlTable,
  varchar,
  text,
  int,
  decimal,
  boolean,
  timestamp,
  mysqlEnum,
  index,
  uniqueIndex,
  primaryKey,
  json,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

import { user } from "."; // adjust path to your Better Auth user table

import { customType } from "drizzle-orm/mysql-core";

const LOCAL_BASE_PATH = "/uploads";

export const pageContents = mysqlTable("page_contents", {
  id: int("id").autoincrement().primaryKey(),
  pageKey: varchar("page_key", { length: 191 }).notNull().unique(),
  title: varchar("title", { length: 255 }),
  content: json("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PageContent = typeof pageContents.$inferSelect;
export type NewPageContent = typeof pageContents.$inferInsert;
export const imagePath = customType<{ data: string; driverData: string }>({
  dataType() {
    return "text";
  },
  fromDriver(value: string): string {
    return `${LOCAL_BASE_PATH}/${value}`;
  },
  toDriver(value: string): string {
    return value;
  },
});

export const videoPath = customType<{ data: string; driverData: string }>({
  dataType() {
    return "text";
  },
  fromDriver(value: string): string {
    if (!value) return value;
    if (value.startsWith("http") || value.startsWith("/uploads/")) return value;
    return `${LOCAL_BASE_PATH}/${value}`;
  },
  toDriver(value: string): string {
    if (value.startsWith(LOCAL_BASE_PATH + "/")) {
      return value.slice(LOCAL_BASE_PATH.length + 1);
    }
    return value;
  },
});
// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// MySQL has no native UUID type — use varchar(36) + crypto.randomUUID()
const uuidCol = (name: string) =>
  varchar(name, { length: 36 }).$defaultFn(() => crypto.randomUUID());

const uuidPk = (name = "id") =>
  varchar(name, { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

// ─────────────────────────────────────────────
// ENUMS (inline per-column in MySQL — no separate pgEnum declarations)
// ─────────────────────────────────────────────
export const videoSourceTypeValues = [
  "local",
  "youtube",
  "vkvideo",
  "rutube",
] as const;

export type VideoSourceType = (typeof videoSourceTypeValues)[number];

const elementPlacementValues = ["home"] as const;
const orderStatusValues = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;
const installationStatusValues = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
] as const;
const deliveryMethodValues = [
  "pickup",
  "courier",
  "transport_company",
  "post",
] as const;
const productConditionValues = ["new", "used", "refurbished"] as const;

// ─────────────────────────────────────────────
// TAGS
// ─────────────────────────────────────────────

export const tag = mysqlTable("tag", {
  id: uuidPk(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const productTag = mysqlTable(
  "productTag",
  {
    productId: varchar("productId", { length: 36 })
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    tagId: varchar("tagId", { length: 36 })
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({
      columns: [t.productId, t.tagId],
      name: "productTag_productId_tagId",
    }),
  ],
);

// ─────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────

export const address = mysqlTable("address", {
  id: uuidPk(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 255 }),
  country: varchar("country", { length: 10 }).notNull().default("RU"),
  city: varchar("city", { length: 255 }).notNull(),
  street: varchar("street", { length: 500 }).notNull(),
  postalCode: varchar("postalCode", { length: 20 }),
  isDefault: boolean("isDefault").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// ─────────────────────────────────────────────
// CATALOG — categories
// ─────────────────────────────────────────────

export const category = mysqlTable("category", {
  id: uuidPk(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: imagePath("imageUrl"),
  parentId: varchar("parentId", { length: 36 }),
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// ─────────────────────────────────────────────
// CATALOG — car models
// ─────────────────────────────────────────────

export const carModel = mysqlTable("carModel", {
  id: uuidPk(),
  brand: varchar("brand", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  generation: varchar("generation", { length: 255 }),
  yearFrom: int("yearFrom"),
  yearTo: int("yearTo"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  imageUrl: imagePath("imageUrl"),
  isPopular: boolean("isPopular").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// ─────────────────────────────────────────────
// CATALOG — products
// ─────────────────────────────────────────────

export const product = mysqlTable(
  "product",
  {
    id: uuidPk(),
    sku: varchar("sku", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 500 }).notNull(),
    description: text("description"),
    model: varchar("model", { length: 255 }),
    generation: varchar("generation", { length: 255 }),
    brand: varchar("brand", { length: 255 }),
    categoryId: varchar("categoryId", { length: 36 }).references(
      () => category.id,
      { onDelete: "set null" },
    ),
    condition: mysqlEnum("condition", productConditionValues)
      .notNull()
      .default("new"),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    compareAtPrice: decimal("compareAtPrice", { precision: 12, scale: 2 }),
    currency: varchar("currency", { length: 10 }).notNull().default("RUB"),
    stockQty: int("stockQty").notNull().default(0),
    isActive: boolean("isActive").notNull().default(true),
    isFeatured: boolean("isFeatured").notNull().default(false),
    weight: decimal("weight", { precision: 8, scale: 3 }),
    sortOrder: int("sortOrder").notNull().default(0),
    metaTitle: varchar("metaTitle", { length: 500 }),
    metaDescription: text("metaDescription"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (t) => [
    index("product_categoryId_idx").on(t.categoryId),
    index("product_price_idx").on(t.price),
  ],
);

export const gallery = mysqlTable("gallery", {
  id: uuidPk(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  placement: mysqlEnum("placement", elementPlacementValues),
  description: text("description"),
});

export const productCarCompatibility = mysqlTable(
  "productCarCompatibility",
  {
    productId: varchar("productId", { length: 36 })
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    carModelId: varchar("carModelId", { length: 36 })
      .notNull()
      .references(() => carModel.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({
      columns: [t.productId, t.carModelId],
      name: "productCarCompatibility_productId_carModelId",
    }),
  ],
);

export const galleryImage = mysqlTable("galleryImage", {
  id: uuidPk(),
  galleryId: varchar("galleryId", { length: 36 })
    .notNull()
    .references(() => gallery.id, { onDelete: "cascade" }),
  url: imagePath("url"),
  altText: varchar("altText", { length: 500 }),
  sortOrder: int("sortOrder").notNull().default(0),
  isPrimary: boolean("isPrimary").notNull().default(false),
});

export const productImage = mysqlTable("productImage", {
  id: uuidPk(),
  productId: varchar("productId", { length: 36 })
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  url: imagePath("url"),
  altText: varchar("altText", { length: 500 }),
  sortOrder: int("sortOrder").notNull().default(0),
  isPrimary: boolean("isPrimary").notNull().default(false),
});

export const video = mysqlTable(
  "video",
  {
    id: uuidPk(),

    // ── Associations (same as before) ──────────────────────────────────────
    productId: varchar("productId", { length: 36 }).references(
      () => product.id,
      { onDelete: "set null" },
    ),
    carModelId: varchar("carModelId", { length: 36 }).references(
      () => carModel.id,
      { onDelete: "cascade" },
    ),

    // ── Source type ────────────────────────────────────────────────────────
    sourceType: mysqlEnum("sourceType", videoSourceTypeValues)
      .notNull()
      .default("local"),

    /**
     * LOCAL  → the file path / storage URL  (e.g. "/uploads/video.mp4")
     * OTHERS → null  (embed sources don't need a raw URL stored)
     */
    url: videoPath("url"),

    /**
     * Platform-side video identifier.
     * YouTube : the part after ?v=  (e.g. "dQw4w9WgXcQ")
     * VK Video: the numeric video ID  (e.g. "456239017")
     * Rutube  : the UUID slug        (e.g. "af7d7bc00ce88c5c8e1e0a3c16cac46d")
     * Local   : null
     */
    videoId: varchar("videoId", { length: 255 }),

    /**
     * VK Video only — the owner ID (negative = community, positive = user).
     * e.g. "-12345678"
     */
    ownerId: varchar("ownerId", { length: 64 }),

    /**
     * VK Video only — optional access_key that appears in the embed URL of
     * non-public videos.  Can be null for fully public videos.
     */
    hash: varchar("hash", { length: 255 }),

    // ── Display metadata ───────────────────────────────────────────────────
    title: varchar("title", { length: 500 }),
    altText: varchar("altText", { length: 500 }),
    placeholderUrl: imagePath("placeholderUrl"),

    // ── Ordering / flags ───────────────────────────────────────────────────
    sortOrder: int("sortOrder").notNull().default(0),
    isPrimary: boolean("isPrimary").notNull().default(false),
  },
  (t) => [
    index("video_productId_idx").on(t.productId),
    index("video_carModelId_idx").on(t.carModelId),
    index("video_sourceType_idx").on(t.sourceType),
  ],
);

export const productAttribute = mysqlTable("productAttribute", {
  id: uuidPk(),
  productId: varchar("productId", { length: 36 })
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 255 }).notNull(),
  value: text("value").notNull(),
});

// ─────────────────────────────────────────────
// PROMOTIONS
// ─────────────────────────────────────────────
// NOTE: a DB trigger (see add_delete_orphaned_promotion_trigger.sql)
// automatically deletes a `promotion` row once its last `productPromotion`
// link is removed, to prevent orphaned promotions.
export const promotion = mysqlTable("promotion", {
  id: uuidPk(),
  name: varchar("title", { length: 500 }).notNull(),
  placement: mysqlEnum("placement", elementPlacementValues),
  description: text("description"),
  imageUrl: imagePath("imageUrl").notNull(),
  discountPercent: decimal("discountPercent", { precision: 5, scale: 2 }),
  discountAmount: decimal("discountAmount", { precision: 12, scale: 2 }),
  startsAt: timestamp("startsAt"),
  endsAt: timestamp("endsAt"),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export const productPromotion = mysqlTable(
  "productPromotion",
  {
    productId: varchar("productId", { length: 36 })
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    promotionId: varchar("promotionId", { length: 36 })
      .notNull()
      .references(() => promotion.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({
      columns: [t.productId, t.promotionId],
      name: "productPromotion_productId_promotionId",
    }),
  ],
);

// ─────────────────────────────────────────────
// WISHLIST
// ─────────────────────────────────────────────

export const wishlistItem = mysqlTable(
  "wishlistItem",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: varchar("productId", { length: 36 })
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (t) => [
    primaryKey({
      columns: [t.userId, t.productId],
      name: "wishlistItem_userId_productId", // ← add this
    }),
  ],
);

// ─────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────

export const cartItem = mysqlTable(
  "cartItem",
  {
    id: uuidPk(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: varchar("productId", { length: 36 })
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    quantity: int("quantity").notNull().default(1),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (t) => [
    uniqueIndex("cartItem_userId_productId_idx").on(t.userId, t.productId),
  ],
);

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

export const order = mysqlTable(
  "order",
  {
    id: uuidPk(),
    orderNumber: varchar("orderNumber", { length: 255 }).notNull().unique(),
    userId: varchar("userId", { length: 255 }).references(() => user.id, {
      onDelete: "set null",
    }),
    contactName: varchar("contactName", { length: 255 }).notNull(),
    contactPhone: varchar("contactPhone", { length: 50 }).notNull(),
    contactEmail: varchar("contactEmail", { length: 255 }),
    deliveryMethod: mysqlEnum("deliveryMethod", deliveryMethodValues)
      .notNull()
      .default("courier"),
    deliveryAddress: text("deliveryAddress"),
    deliveryCity: varchar("deliveryCity", { length: 255 }),
    deliveryPostalCode: varchar("deliveryPostalCode", { length: 20 }),
    trackingNumber: varchar("trackingNumber", { length: 255 }),
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
    discountAmount: decimal("discountAmount", {
      precision: 12,
      scale: 2,
    }).default("0.00"),
    deliveryCost: decimal("deliveryCost", { precision: 12, scale: 2 }).default(
      "0.00",
    ),
    total: decimal("total", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("RUB"),
    status: mysqlEnum("status", orderStatusValues).notNull().default("pending"),
    notes: text("notes"),
    needsInstallation: boolean("needsInstallation").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (t) => [
    index("order_userId_idx").on(t.userId),
    index("order_status_idx").on(t.status),
  ],
);

export const orderItem = mysqlTable("orderItem", {
  id: uuidPk(),
  orderId: varchar("orderId", { length: 36 })
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  productId: varchar("productId", { length: 36 }).references(() => product.id, {
    onDelete: "set null",
  }),
  productName: varchar("productName", { length: 500 }).notNull(),
  productSku: varchar("productSku", { length: 255 }).notNull(),
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
  totalPrice: decimal("totalPrice", { precision: 12, scale: 2 }).notNull(),
});

// ─────────────────────────────────────────────
// INSTALLATION BOOKINGS
// ─────────────────────────────────────────────

export const installationBooking = mysqlTable("installationBooking", {
  id: uuidPk(),
  orderId: varchar("orderId", { length: 36 }).references(() => order.id, {
    onDelete: "set null",
  }),
  userId: varchar("userId", { length: 255 }).references(() => user.id, {
    onDelete: "set null",
  }),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 50 }).notNull(),
  carBrand: varchar("carBrand", { length: 255 }).notNull(),
  carModel: varchar("carModel", { length: 255 }).notNull(),
  carYear: int("carYear"),
  scheduledAt: timestamp("scheduledAt"),
  status: mysqlEnum("status", installationStatusValues)
    .notNull()
    .default("scheduled"),
  notes: text("notes"),
  technicianNotes: text("technicianNotes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// ─────────────────────────────────────────────
// GIBDD REGISTRATION REQUESTS
// ─────────────────────────────────────────────

export const gibddRegistration = mysqlTable("gibddRegistration", {
  id: uuidPk(),
  userId: varchar("userId", { length: 255 }).references(() => user.id, {
    onDelete: "set null",
  }),
  orderId: varchar("orderId", { length: 36 }).references(() => order.id, {
    onDelete: "set null",
  }),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 50 }).notNull(),
  carVin: varchar("carVin", { length: 50 }),
  carPlate: varchar("carPlate", { length: 20 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────

export const review = mysqlTable(
  "review",
  {
    id: uuidPk(),
    userId: varchar("userId", { length: 255 }).references(() => user.id, {
      onDelete: "set null",
    }),
    productId: varchar("productId", { length: 36 }).references(
      () => product.id,
      { onDelete: "cascade" },
    ),
    orderId: varchar("orderId", { length: 36 }).references(() => order.id, {
      onDelete: "set null",
    }),
    authorName: varchar("authorName", { length: 255 }).notNull(),
    rating: int("rating").notNull(),
    body: text("body"),
    isVerifiedPurchase: boolean("isVerifiedPurchase").notNull().default(false),
    isPublished: boolean("isPublished").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (t) => [index("review_productId_idx").on(t.productId)],
);

export const auditLog = mysqlTable(
  "auditLog",
  {
    id: uuidPk(),
    userId: varchar("userId", { length: 255 }).references(() => user.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 255 }).notNull(),
    success: boolean("success").notNull().default(true),
    metadata: text("metadata"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (t) => [
    index("auditLog_userId_idx").on(t.userId),
    index("auditLog_action_idx").on(t.action),
    index("auditLog_createdAt_idx").on(t.createdAt),
  ],
);

// ─────────────────────────────────────────────
// CERTIFICATES
// ─────────────────────────────────────────────

export const certificate = mysqlTable("certificate", {
  id: uuidPk(),
  title: varchar("title", { length: 500 }).notNull().unique(),
  issuer: varchar("issuer", { length: 255 }),
  issuedAt: timestamp("issuedAt"),
  expiresAt: timestamp("expiresAt"),
  imageUrl: imagePath("imageUrl"),
  fileUrl: varchar("fileUrl", { length: 1000 }),
  isActive: boolean("isActive").notNull().default(true),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// ─────────────────────────────────────────────
// RELATIONS (unchanged from original)
// ─────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  addresses: many(address),
  orders: many(order),
  reviews: many(review),
  wishlistItems: many(wishlistItem),
  cartItems: many(cartItem),
  installationBookings: many(installationBooking),
  gibddRegistrations: many(gibddRegistration),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
  parent: one(category, {
    fields: [category.parentId],
    references: [category.id],
    relationName: "subcategories",
  }),
  children: many(category, { relationName: "subcategories" }),
  products: many(product),
}));

export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  images: many(productImage),
  videos: many(video),
  tags: many(productTag),
  attributes: many(productAttribute),
  carCompatibility: many(productCarCompatibility),
  promotions: many(productPromotion),
  reviews: many(review),
  orderItems: many(orderItem),
  wishlistItems: many(wishlistItem),
  cartItems: many(cartItem),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, { fields: [order.userId], references: [user.id] }),
  items: many(orderItem),
  installationBooking: one(installationBooking),
  gibddRegistration: one(gibddRegistration),
  reviews: many(review),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, { fields: [orderItem.orderId], references: [order.id] }),
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),
}));

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, { fields: [review.userId], references: [user.id] }),
  product: one(product, {
    fields: [review.productId],
    references: [product.id],
  }),
  order: one(order, { fields: [review.orderId], references: [order.id] }),
}));

export const installationBookingRelations = relations(
  installationBooking,
  ({ one }) => ({
    order: one(order, {
      fields: [installationBooking.orderId],
      references: [order.id],
    }),
    user: one(user, {
      fields: [installationBooking.userId],
      references: [user.id],
    }),
  }),
);

export const gibddRegistrationRelations = relations(
  gibddRegistration,
  ({ one }) => ({
    order: one(order, {
      fields: [gibddRegistration.orderId],
      references: [order.id],
    }),
    user: one(user, {
      fields: [gibddRegistration.userId],
      references: [user.id],
    }),
  }),
);

export const productCarCompatibilityRelations = relations(
  productCarCompatibility,
  ({ one }) => ({
    product: one(product, {
      fields: [productCarCompatibility.productId],
      references: [product.id],
    }),
    carModel: one(carModel, {
      fields: [productCarCompatibility.carModelId],
      references: [carModel.id],
    }),
  }),
);

export const productPromotionRelations = relations(
  productPromotion,
  ({ one }) => ({
    product: one(product, {
      fields: [productPromotion.productId],
      references: [product.id],
    }),
    promotion: one(promotion, {
      fields: [productPromotion.promotionId],
      references: [promotion.id],
    }),
  }),
);

export const addressRelations = relations(address, ({ one }) => ({
  user: one(user, { fields: [address.userId], references: [user.id] }),
}));

export const wishlistItemRelations = relations(wishlistItem, ({ one }) => ({
  user: one(user, { fields: [wishlistItem.userId], references: [user.id] }),
  product: one(product, {
    fields: [wishlistItem.productId],
    references: [product.id],
  }),
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
  user: one(user, { fields: [cartItem.userId], references: [user.id] }),
  product: one(product, {
    fields: [cartItem.productId],
    references: [product.id],
  }),
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
  product: one(product, {
    fields: [productImage.productId],
    references: [product.id],
  }),
}));

export const videoRelations = relations(video, ({ one }) => ({
  product: one(product, {
    fields: [video.productId],
    references: [product.id],
  }),
  carModel: one(carModel, {
    fields: [video.carModelId],
    references: [carModel.id],
  }),
}));

export const galleryImageRelations = relations(galleryImage, ({ one }) => ({
  gallery: one(gallery, {
    fields: [galleryImage.galleryId],
    references: [gallery.id],
  }),
}));

export const productAttributeRelations = relations(
  productAttribute,
  ({ one }) => ({
    product: one(product, {
      fields: [productAttribute.productId],
      references: [product.id],
    }),
  }),
);

export const promotionRelations = relations(promotion, ({ many }) => ({
  productPromotion: many(productPromotion),
}));

export const galleryRelations = relations(gallery, ({ many }) => ({
  images: many(galleryImage),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  productTags: many(productTag),
}));

export const productTagRelations = relations(productTag, ({ one }) => ({
  product: one(product, {
    fields: [productTag.productId],
    references: [product.id],
  }),
  tag: one(tag, { fields: [productTag.tagId], references: [tag.id] }),
}));

export const carModelRelations = relations(carModel, ({ many }) => ({
  videos: many(video),
  carCompatibility: many(productCarCompatibility),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(user, { fields: [auditLog.userId], references: [user.id] }),
}));
