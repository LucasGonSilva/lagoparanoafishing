#!/bin/sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"

docker run --rm \
  -v "${ROOT}/frontend":/app \
  -v "${ROOT}/backend/public":/public \
  -w /app \
  node:22-alpine \
  sh -c "npm install && npx vite build --outDir /public --emptyOutDir false"

test -f "${ROOT}/backend/public/index.php"
test -f "${ROOT}/backend/public/index.html"
test -d "${ROOT}/backend/public/assets"
echo "Front compilado em backend/public (index.php preservado)."
