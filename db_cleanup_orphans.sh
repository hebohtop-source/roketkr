#!/bin/bash

# ─────────────────────────────────────────
# Orphan Cleanup Script (DESTRUCTIVE)
# Deletes orphaned records based on FK relations
# Always run db_audit_orphans.sh first!
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

# ── Safety confirmation ───────────────────
echo "⚠️  WARNING: This will permanently delete orphaned records from: $DB_NAME"
echo "   Run db_audit_orphans.sh first to review what will be deleted."
echo ""
read -p "Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Aborted."
  exit 0
fi

run_delete() {
  local label="$1"
  local sql="$2"

  local count=$(docker exec "$CONTAINER" mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" \
    --silent --skip-column-names -e "SELECT ROW_COUNT(); $sql" 2>/dev/null | tail -1)

  docker exec "$CONTAINER" mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" \
    --silent -e "$sql" 2>/dev/null

  local affected=$(docker exec "$CONTAINER" mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" \
    --silent --skip-column-names -e "SELECT ROW_COUNT()" 2>/dev/null)

  if [ "$affected" -gt 0 ] 2>/dev/null; then
    echo "  🗑️  $label — deleted $affected row(s)"
  else
    echo "  ✅ $label — nothing to delete"
  fi
}

echo ""
echo "======================================================"
echo "  ORPHAN CLEANUP — $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================================"

# ── Junction / pivot tables first (no dependents) ────
run_delete "productTag (orphan productId)" \
  "DELETE pt FROM productTag pt
   LEFT JOIN product p ON pt.productId = p.id
   WHERE p.id IS NULL"

run_delete "productTag (orphan tagId)" \
  "DELETE pt FROM productTag pt
   LEFT JOIN tag t ON pt.tagId = t.id
   WHERE t.id IS NULL"

run_delete "productCarCompatibility (orphan productId)" \
  "DELETE pc FROM productCarCompatibility pc
   LEFT JOIN product p ON pc.productId = p.id
   WHERE p.id IS NULL"

run_delete "productCarCompatibility (orphan carModelId)" \
  "DELETE pc FROM productCarCompatibility pc
   LEFT JOIN carModel cm ON pc.carModelId = cm.id
   WHERE cm.id IS NULL"

run_delete "productPromotion (orphan productId)" \
  "DELETE pp FROM productPromotion pp
   LEFT JOIN product p ON pp.productId = p.id
   WHERE p.id IS NULL"

run_delete "productPromotion (orphan promotionId)" \
  "DELETE pp FROM productPromotion pp
   LEFT JOIN promotion pr ON pp.promotionId = pr.id
   WHERE pr.id IS NULL"

run_delete "wishlistItem (orphan userId)" \
  "DELETE w FROM wishlistItem w
   LEFT JOIN user u ON w.userId = u.id
   WHERE u.id IS NULL"

run_delete "wishlistItem (orphan productId)" \
  "DELETE w FROM wishlistItem w
   LEFT JOIN product p ON w.productId = p.id
   WHERE p.id IS NULL"

# ── Child rows that reference orders/products/users ──
run_delete "orderItem (orphan orderId)" \
  "DELETE oi FROM orderItem oi
   LEFT JOIN \`order\` o ON oi.orderId = o.id
   WHERE o.id IS NULL"

run_delete "orderItem (orphan productId)" \
  "DELETE oi FROM orderItem oi
   LEFT JOIN product p ON oi.productId = p.id
   WHERE oi.productId IS NOT NULL AND p.id IS NULL"

run_delete "review (orphan productId)" \
  "DELETE r FROM review r
   LEFT JOIN product p ON r.productId = p.id
   WHERE r.productId IS NOT NULL AND p.id IS NULL"

run_delete "review (orphan orderId)" \
  "DELETE r FROM review r
   LEFT JOIN \`order\` o ON r.orderId = o.id
   WHERE r.orderId IS NOT NULL AND o.id IS NULL"

run_delete "review (orphan userId)" \
  "DELETE r FROM review r
   LEFT JOIN user u ON r.userId = u.id
   WHERE r.userId IS NOT NULL AND u.id IS NULL"

run_delete "installationBooking (orphan orderId)" \
  "DELETE ib FROM installationBooking ib
   LEFT JOIN \`order\` o ON ib.orderId = o.id
   WHERE ib.orderId IS NOT NULL AND o.id IS NULL"

run_delete "installationBooking (orphan userId)" \
  "DELETE ib FROM installationBooking ib
   LEFT JOIN user u ON ib.userId = u.id
   WHERE ib.userId IS NOT NULL AND u.id IS NULL"

run_delete "gibddRegistration (orphan orderId)" \
  "DELETE gr FROM gibddRegistration gr
   LEFT JOIN \`order\` o ON gr.orderId = o.id
   WHERE gr.orderId IS NOT NULL AND o.id IS NULL"

run_delete "gibddRegistration (orphan userId)" \
  "DELETE gr FROM gibddRegistration gr
   LEFT JOIN user u ON gr.userId = u.id
   WHERE gr.userId IS NOT NULL AND u.id IS NULL"

run_delete "cartItem (orphan userId)" \
  "DELETE c FROM cartItem c
   LEFT JOIN user u ON c.userId = u.id
   WHERE u.id IS NULL"

run_delete "cartItem (orphan productId)" \
  "DELETE c FROM cartItem c
   LEFT JOIN product p ON c.productId = p.id
   WHERE p.id IS NULL"

run_delete "address (orphan userId)" \
  "DELETE a FROM address a
   LEFT JOIN user u ON a.userId = u.id
   WHERE u.id IS NULL"

run_delete "productImage (orphan productId)" \
  "DELETE pi FROM productImage pi
   LEFT JOIN product p ON pi.productId = p.id
   WHERE p.id IS NULL"

run_delete "galleryImage (orphan galleryId)" \
  "DELETE gi FROM galleryImage gi
   LEFT JOIN gallery g ON gi.galleryId = g.id
   WHERE g.id IS NULL"

run_delete "video (orphan productId)" \
  "DELETE v FROM video v
   LEFT JOIN product p ON v.productId = p.id
   WHERE v.productId IS NOT NULL AND p.id IS NULL"

run_delete "video (orphan carModelId)" \
  "DELETE v FROM video v
   LEFT JOIN carModel cm ON v.carModelId = cm.id
   WHERE v.carModelId IS NOT NULL AND cm.id IS NULL"

run_delete "productAttribute (orphan productId)" \
  "DELETE pa FROM productAttribute pa
   LEFT JOIN product p ON pa.productId = p.id
   WHERE p.id IS NULL"

run_delete "product (orphan categoryId)" \
  "DELETE p FROM product p
   LEFT JOIN category c ON p.categoryId = c.id
   WHERE p.categoryId IS NOT NULL AND c.id IS NULL"

run_delete "category (orphan parentId)" \
  "DELETE c FROM category c
   LEFT JOIN category parent ON c.parentId = parent.id
   WHERE c.parentId IS NOT NULL AND parent.id IS NULL"

run_delete "order (orphan userId)" \
  "DELETE o FROM \`order\` o
   LEFT JOIN user u ON o.userId = u.id
   WHERE o.userId IS NOT NULL AND u.id IS NULL"

echo ""
echo "======================================================"
echo "  CLEANUP COMPLETE"
echo "======================================================"
