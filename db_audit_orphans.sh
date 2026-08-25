#!/bin/bash

# ─────────────────────────────────────────
# Orphan Audit Script (READ-ONLY)
# Shows all orphaned records based on FK relations
# ─────────────────────────────────────────

DATABASE_URL="mysql://appuser:apppassword@localhost:3306/appdb"

DB_USER=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d':' -f1)
DB_PASS=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d':' -f2 | cut -d'@' -f1)
DB_NAME=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d'/' -f2)

CONTAINER=$(docker ps --filter "expose=3306" --format "{{.Names}}" | head -n 1)

if [ -z "$CONTAINER" ]; then
  echo "❌ No running MySQL container found"
  exit 1
fi

run_query() {
  local label="$1"
  local sql="$2"

  echo ""
  echo "┌─────────────────────────────────────────"
  echo "│ $label"
  echo "└─────────────────────────────────────────"
  docker exec "$CONTAINER" mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" \
    --silent --table -e "$sql" 2>/dev/null
  local count=$(docker exec "$CONTAINER" mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" \
    --silent --skip-column-names -e "SELECT COUNT(*) FROM ($sql) AS _c" 2>/dev/null)
  echo "  ↳ $count orphaned row(s)"
}

echo "======================================================"
echo "  ORPHAN AUDIT — $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================================"

# ── address ──────────────────────────────
run_query "address → user (missing userId)" \
  "SELECT a.id, a.userId, a.city FROM address a
   LEFT JOIN user u ON a.userId = u.id
   WHERE u.id IS NULL"

# ── cartItem ─────────────────────────────
run_query "cartItem → user (missing userId)" \
  "SELECT c.id, c.userId FROM cartItem c
   LEFT JOIN user u ON c.userId = u.id
   WHERE u.id IS NULL"

run_query "cartItem → product (missing productId)" \
  "SELECT c.id, c.productId FROM cartItem c
   LEFT JOIN product p ON c.productId = p.id
   WHERE p.id IS NULL"

# ── wishlistItem ──────────────────────────
run_query "wishlistItem → user (missing userId)" \
  "SELECT w.userId, w.productId FROM wishlistItem w
   LEFT JOIN user u ON w.userId = u.id
   WHERE u.id IS NULL"

run_query "wishlistItem → product (missing productId)" \
  "SELECT w.userId, w.productId FROM wishlistItem w
   LEFT JOIN product p ON w.productId = p.id
   WHERE p.id IS NULL"

# ── product ───────────────────────────────
run_query "product → category (missing categoryId, non-null only)" \
  "SELECT p.id, p.sku, p.categoryId FROM product p
   LEFT JOIN category c ON p.categoryId = c.id
   WHERE p.categoryId IS NOT NULL AND c.id IS NULL"

# ── category (self-referential) ───────────
run_query "category → parent category (missing parentId, non-null only)" \
  "SELECT c.id, c.slug, c.parentId FROM category c
   LEFT JOIN category parent ON c.parentId = parent.id
   WHERE c.parentId IS NOT NULL AND parent.id IS NULL"

# ── productImage ──────────────────────────
run_query "productImage → product (missing productId)" \
  "SELECT pi.id, pi.productId FROM productImage pi
   LEFT JOIN product p ON pi.productId = p.id
   WHERE p.id IS NULL"

# ── galleryImage ──────────────────────────
run_query "galleryImage → gallery (missing galleryId)" \
  "SELECT gi.id, gi.galleryId FROM galleryImage gi
   LEFT JOIN gallery g ON gi.galleryId = g.id
   WHERE g.id IS NULL"

# ── video ─────────────────────────────────
run_query "video → product (missing productId, non-null only)" \
  "SELECT v.id, v.productId FROM video v
   LEFT JOIN product p ON v.productId = p.id
   WHERE v.productId IS NOT NULL AND p.id IS NULL"

run_query "video → carModel (missing carModelId, non-null only)" \
  "SELECT v.id, v.carModelId FROM video v
   LEFT JOIN carModel cm ON v.carModelId = cm.id
   WHERE v.carModelId IS NOT NULL AND cm.id IS NULL"

# ── productAttribute ──────────────────────
run_query "productAttribute → product (missing productId)" \
  "SELECT pa.id, pa.productId, pa.key FROM productAttribute pa
   LEFT JOIN product p ON pa.productId = p.id
   WHERE p.id IS NULL"

# ── productTag ────────────────────────────
run_query "productTag → product (missing productId)" \
  "SELECT pt.productId, pt.tagId FROM productTag pt
   LEFT JOIN product p ON pt.productId = p.id
   WHERE p.id IS NULL"

run_query "productTag → tag (missing tagId)" \
  "SELECT pt.productId, pt.tagId FROM productTag pt
   LEFT JOIN tag t ON pt.tagId = t.id
   WHERE t.id IS NULL"

# ── productCarCompatibility ───────────────
run_query "productCarCompatibility → product (missing productId)" \
  "SELECT pc.productId, pc.carModelId FROM productCarCompatibility pc
   LEFT JOIN product p ON pc.productId = p.id
   WHERE p.id IS NULL"

run_query "productCarCompatibility → carModel (missing carModelId)" \
  "SELECT pc.productId, pc.carModelId FROM productCarCompatibility pc
   LEFT JOIN carModel cm ON pc.carModelId = cm.id
   WHERE cm.id IS NULL"

# ── productPromotion ──────────────────────
run_query "productPromotion → product (missing productId)" \
  "SELECT pp.productId, pp.promotionId FROM productPromotion pp
   LEFT JOIN product p ON pp.productId = p.id
   WHERE p.id IS NULL"

run_query "productPromotion → promotion (missing promotionId)" \
  "SELECT pp.productId, pp.promotionId FROM productPromotion pp
   LEFT JOIN promotion pr ON pp.promotionId = pr.id
   WHERE pr.id IS NULL"

# ── order ─────────────────────────────────
run_query "order → user (missing userId, non-null only)" \
  "SELECT o.id, o.orderNumber, o.userId FROM \`order\` o
   LEFT JOIN user u ON o.userId = u.id
   WHERE o.userId IS NOT NULL AND u.id IS NULL"

# ── orderItem ─────────────────────────────
run_query "orderItem → order (missing orderId)" \
  "SELECT oi.id, oi.orderId FROM orderItem oi
   LEFT JOIN \`order\` o ON oi.orderId = o.id
   WHERE o.id IS NULL"

run_query "orderItem → product (missing productId, non-null only)" \
  "SELECT oi.id, oi.productId FROM orderItem oi
   LEFT JOIN product p ON oi.productId = p.id
   WHERE oi.productId IS NOT NULL AND p.id IS NULL"

# ── installationBooking ───────────────────
run_query "installationBooking → order (missing orderId, non-null only)" \
  "SELECT ib.id, ib.orderId FROM installationBooking ib
   LEFT JOIN \`order\` o ON ib.orderId = o.id
   WHERE ib.orderId IS NOT NULL AND o.id IS NULL"

run_query "installationBooking → user (missing userId, non-null only)" \
  "SELECT ib.id, ib.userId FROM installationBooking ib
   LEFT JOIN user u ON ib.userId = u.id
   WHERE ib.userId IS NOT NULL AND u.id IS NULL"

# ── gibddRegistration ─────────────────────
run_query "gibddRegistration → order (missing orderId, non-null only)" \
  "SELECT gr.id, gr.orderId FROM gibddRegistration gr
   LEFT JOIN \`order\` o ON gr.orderId = o.id
   WHERE gr.orderId IS NOT NULL AND o.id IS NULL"

run_query "gibddRegistration → user (missing userId, non-null only)" \
  "SELECT gr.id, gr.userId FROM gibddRegistration gr
   LEFT JOIN user u ON gr.userId = u.id
   WHERE gr.userId IS NOT NULL AND u.id IS NULL"

# ── review ────────────────────────────────
run_query "review → product (missing productId, non-null only)" \
  "SELECT r.id, r.productId FROM review r
   LEFT JOIN product p ON r.productId = p.id
   WHERE r.productId IS NOT NULL AND p.id IS NULL"

run_query "review → order (missing orderId, non-null only)" \
  "SELECT r.id, r.orderId FROM review r
   LEFT JOIN \`order\` o ON r.orderId = o.id
   WHERE r.orderId IS NOT NULL AND o.id IS NULL"

run_query "review → user (missing userId, non-null only)" \
  "SELECT r.id, r.userId FROM review r
   LEFT JOIN user u ON r.userId = u.id
   WHERE r.userId IS NOT NULL AND u.id IS NULL"

echo ""
echo "======================================================"
echo "  AUDIT COMPLETE"
echo "  Run db_cleanup_orphans.sh to delete them"
echo "======================================================"
