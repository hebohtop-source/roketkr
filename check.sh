#!/bin/zsh
export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin
grep -rl '"use client"' src/ | xargs grep -l '@/db\|@/lib/services' | while read file; do
  imports=$(grep -o '"@/lib/services/[^"]*"' "$file" | tr -d '"')
  for import in $imports; do
    path="src/${import#@/}.ts"
    if ! grep -q '"use server"' "$path" 2>/dev/null; then
      echo "$file -> $import (NOT use server)"
    fi
  done
done
