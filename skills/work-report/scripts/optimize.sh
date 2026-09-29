#!/usr/bin/env bash
# work-report, step 5: crop and compress one screenshot for the report.
#
#   scripts/optimize.sh <in.png> <out.webp> [WxH+X+Y]
#
# The crop is in the PNG's own pixels (a 1440x900 capture at scale 2 is 2880x1800).
# Output is at most 1600px wide, WebP quality 80: a full-page shot lands around 40-80 KB.
# Needs ImageMagick 7 (`magick`) or 6 (`convert`).
set -euo pipefail

die() { echo "optimize.sh: $*" >&2; exit 1; }
[ $# -ge 2 ] || die "usage: optimize.sh <in.png> <out.webp> [WxH+X+Y]"
in=$1; out=$2; crop=${3:-}
[ -f "$in" ] || die "$in not found"
if command -v magick >/dev/null; then im=magick
elif command -v convert >/dev/null; then im=convert
else die "ImageMagick not found (install imagemagick)"; fi

mkdir -p "$(dirname "$out")"
if [ -n "$crop" ]; then
  [[ "$crop" =~ ^[0-9]+x[0-9]+\+[0-9]+\+[0-9]+$ ]] || die "crop must look like 650x380+1750+1230"
  "$im" "$in" -crop "$crop" +repage -resize '1600x>' -quality 80 "$out"
else
  "$im" "$in" -resize '1600x>' -quality 80 "$out"
fi
dims=$("$im" identify -format '%wx%h' "$out" 2>/dev/null || identify -format '%wx%h' "$out")
echo "$out  ${dims}  $(du -h "$out" | cut -f1)   ← use these as the <img> width/height"
