#!/usr/bin/env bash
# Generates PNG thumbnails and large previews from PDFs in docs/assets/certs
# Requires: pdftoppm (poppler-utils)

set -euo pipefail
cd "$(dirname "$0")/.."
DATADIR=docs/assets/certs
META=docs/certs/metadata.json

if ! command -v pdftoppm >/dev/null 2>&1; then
  echo "pdftoppm not found. Install poppler-utils (pdftoppm) and re-run this script." >&2
  exit 2
fi

echo "Scanning PDFs in $DATADIR ..."
for pdf in "$DATADIR"/*.pdf; do
  [ -f "$pdf" ] || continue
  fname=$(basename "$pdf")
  # create id from filename by removing extension and non-alphanum
  id=$(echo "$fname" | sed 's/\.[^.]*$//; s/[^a-zA-Z0-9._-]/-/g' | tr '[:upper:]' '[:lower:]')
  thumb="$DATADIR/thumb-$id.png"
  large="$DATADIR/large-$id.png"
  echo "Generating thumb and large for $fname -> $thumb, $large"
  # thumbnail ~400px width (keep aspect)
  pdftoppm -png -singlefile -scale-to-x 400 -scale-to-y 0 "$pdf" "$DATADIR/thumb-$id" >/dev/null 2>&1 || true
  # large ~1200px width
  pdftoppm -png -singlefile -scale-to-x 1200 -scale-to-y 0 "$pdf" "$DATADIR/large-$id" >/dev/null 2>&1 || true
done

echo "Thumbnail generation complete. Now update metadata.json to point to PNGs if desired."
echo "You may run: python3 tools/update_metadata_with_pngs.py"
