#!/bin/bash

# ─────────────────────────────────────────
# Interactive MySQL Table Dump
# Select one or more tables to dump
# ─────────────────────────────────────────

DATABASE_URL="mysql://appuser:apppassword@localhost:3306/appdb"

DB_USER=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d':' -f1)
DB_PASS=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d':' -f2 | cut -d'@' -f1)
DB_NAME=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d'/' -f2)

CONTAINER=$(docker ps --filter "expose=3306" --format "{{.Names}}" | head -n 1)
OUTPUT_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# ── Sanity checks ─────────────────────────
if [ -z "$CONTAINER" ]; then
  echo "❌ No running MySQL container found on port 3306"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

# ── Fetch table list from DB ──────────────
echo "🔌 Connected to container: $CONTAINER  DB: $DB_NAME"
echo ""

TABLES=$(docker exec "$CONTAINER" mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" \
  --silent --skip-column-names -e "SHOW TABLES;" 2>/dev/null)

if [ -z "$TABLES" ]; then
  echo "❌ No tables found (check credentials or DB name)"
  exit 1
fi

TABLE_ARRAY=($TABLES)
TOTAL=${#TABLE_ARRAY[@]}

# ── Check if fzf is available ─────────────
if command -v fzf &>/dev/null; then
  USE_FZF=true
else
  USE_FZF=false
fi

# ─────────────────────────────────────────
# SELECTION UI
# ─────────────────────────────────────────

if $USE_FZF; then
  # fzf multi-select mode
  echo "  Use TAB to select/deselect, ENTER to confirm, CTRL-A to select all"
  echo ""
  SELECTED=$(printf '%s\n' "${TABLE_ARRAY[@]}" |
    fzf --multi \
      --prompt="Select tables > " \
      --header="TAB=toggle  CTRL-A=all  ENTER=confirm" \
      --bind "ctrl-a:select-all" \
      --height=60% \
      --border=rounded)

  if [ -z "$SELECTED" ]; then
    echo "Nothing selected. Exiting."
    exit 0
  fi

  CHOSEN=($SELECTED)

else
  # Fallback: numbered menu with manual selection
  echo "  Available tables:"
  echo ""
  for i in "${!TABLE_ARRAY[@]}"; do
    printf "  [%2d] %s\n" "$((i + 1))" "${TABLE_ARRAY[$i]}"
  done
  echo ""
  echo "  Enter table numbers separated by spaces (e.g. 1 3 5)"
  echo "  Or type 'all' to dump everything"
  echo ""
  read -p "  > " INPUT

  CHOSEN=()
  if [ "$INPUT" = "all" ]; then
    CHOSEN=("${TABLE_ARRAY[@]}")
  else
    for num in $INPUT; do
      idx=$((num - 1))
      if [ "$idx" -ge 0 ] && [ "$idx" -lt "$TOTAL" ]; then
        CHOSEN+=("${TABLE_ARRAY[$idx]}")
      else
        echo "  ⚠️  Skipping invalid number: $num"
      fi
    done
  fi

  if [ ${#CHOSEN[@]} -eq 0 ]; then
    echo "Nothing selected. Exiting."
    exit 0
  fi
fi

# ─────────────────────────────────────────
# DUMP MODE SELECTION
# ─────────────────────────────────────────
echo ""
echo "  Dump mode:"
echo "  [1] One file per table  (backups/<table>_<timestamp>.sql)"
echo "  [2] All selected into one file  (backups/dump_<timestamp>.sql)"
echo ""
read -p "  > " MODE_INPUT

case "$MODE_INPUT" in
2) SINGLE_FILE=true ;;
*) SINGLE_FILE=false ;;
esac

# ─────────────────────────────────────────
# SCHEMA-ONLY OPTION
# ─────────────────────────────────────────
echo ""
echo "  Include data?"
echo "  [1] Schema + data  (default)"
echo "  [2] Schema only (no INSERT rows)"
echo ""
read -p "  > " DATA_INPUT

case "$DATA_INPUT" in
2) NO_DATA="--no-data" ;;
*) NO_DATA="" ;;
esac

# ─────────────────────────────────────────
# RUN DUMPS
# ─────────────────────────────────────────
echo ""
echo "======================================================"
echo "  Dumping ${#CHOSEN[@]} table(s)..."
echo "======================================================"

COMBINED_FILE="$OUTPUT_DIR/dump_${DB_NAME}_${TIMESTAMP}.sql"
SUCCESS=0
FAIL=0

dump_table() {
  local table="$1"
  local outfile="$2"

  docker exec "$CONTAINER" mysqldump \
    -u "$DB_USER" \
    -p"$DB_PASS" \
    --single-transaction \
    --no-tablespaces \
    $NO_DATA \
    "$DB_NAME" "$table" >>"$outfile" 2>/dev/null

  return $?
}

if $SINGLE_FILE; then
  echo "-- Combined dump: ${#CHOSEN[@]} tables from $DB_NAME" >"$COMBINED_FILE"
  echo "-- Generated: $(date)" >>"$COMBINED_FILE"
  echo "" >>"$COMBINED_FILE"
fi

for table in "${CHOSEN[@]}"; do
  if $SINGLE_FILE; then
    echo -n "  Dumping $table ... "
    echo "-- ───────────────── $table ─────────────────" >>"$COMBINED_FILE"
    dump_table "$table" "$COMBINED_FILE"
  else
    OUTFILE="$OUTPUT_DIR/${table}_${TIMESTAMP}.sql"
    echo -n "  Dumping $table ... "
    >"$OUTFILE"
    dump_table "$table" "$OUTFILE"
  fi

  if [ $? -eq 0 ]; then
    if ! $SINGLE_FILE; then
      SIZE=$(du -sh "$OUTFILE" | cut -f1)
      echo "✅ ($SIZE) → ${OUTFILE}"
    else
      echo "✅"
    fi
    ((SUCCESS++))
  else
    echo "❌ failed"
    ((FAIL++))
  fi
done

echo ""
echo "======================================================"
if $SINGLE_FILE; then
  SIZE=$(du -sh "$COMBINED_FILE" | cut -f1)
  echo "  📦 Output: $COMBINED_FILE ($SIZE)"
fi
echo "  ✅ $SUCCESS succeeded   ❌ $FAIL failed"
echo "======================================================"
