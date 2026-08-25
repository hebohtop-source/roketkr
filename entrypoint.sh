#!/bin/sh
set -e
echo "▶ Running DB migrations (drizzle-kit push)..."
bun x drizzle-kit push
echo "▶ Starting Next.js..."
exec bun server.js
