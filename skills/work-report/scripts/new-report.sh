#!/usr/bin/env bash
# work-report, step 6: scaffold a report from the template with the header numbers filled.
#
#   scripts/new-report.sh <gather-dir> <report-dir> "<Project name>"
#
# Creates <report-dir>/index.html and <report-dir>/img/. Fills from <gather-dir>/totals.json:
# project name, repo URL in every PR link, the date range, the PR range, the merged count and
# the GitHub-style +/- line totals. Every other {{placeholder}} is left for you, and
# scripts/check-report.mjs refuses to pass until they are all gone.
set -euo pipefail

die() { echo "new-report.sh: $*" >&2; exit 1; }
[ $# -eq 3 ] || die 'usage: new-report.sh <gather-dir> <report-dir> "<Project name>"'
gather=$1; out=$2; project=$3
here=$(cd "$(dirname "$0")" && pwd)
tpl="$here/../assets/template.html"
[ -f "$gather/totals.json" ] || die "$gather/totals.json not found; run scripts/gather.sh first"
[ -e "$out/index.html" ] && die "$out/index.html already exists; not overwriting"
command -v jq >/dev/null || die "jq is not installed"
command -v node >/dev/null || die "node is not installed"

mkdir -p "$out/img"
node - "$tpl" "$out/index.html" "$gather/totals.json" "$project" <<'JS'
const fs = require("fs");
const [tpl, dest, totalsPath, project] = process.argv.slice(2);
const t = JSON.parse(fs.readFileSync(totalsPath, "utf8"));
const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const d = (s) => new Date(s + "T00:00:00Z");
const from = d(t.from), to = d(t.to);
// "Sep 25–29" within a month, "Sep 28–Oct 3" across months.
const short = from.getUTCMonth() === to.getUTCMonth()
  ? `${M[from.getUTCMonth()]} ${from.getUTCDate()}–${to.getUTCDate()}`
  : `${M[from.getUTCMonth()]} ${from.getUTCDate()}–${M[to.getUTCMonth()]} ${to.getUTCDate()}`;
const k = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n));
const closedNote = t.closed ? ` (plus ${t.closed} closed)` : "";
let s = fs.readFileSync(tpl, "utf8");
const fill = {
  "{{Project}}": project,
  "{{repo-url}}": t.repoUrl,
  "{{Mon D–D, YYYY}}": `${short}, ${to.getUTCFullYear()}`,
  "{{Mon D–D}}": short,
  "{{first}}": String(t.first),
  "{{last}}": String(t.last),
  "{{PRs}}": String(t.merged),
  "{{ (plus N closed and folded into later ones)}}": closedNote,
  "+{{16.4k}}": "+" + k(t.additions),
  "−{{3.3k}}": "−" + k(t.deletions),
};
for (const [a, b] of Object.entries(fill)) s = s.split(a).join(b);
fs.writeFileSync(dest, s);
const left = (s.match(/\{\{[^}]*\}\}/g) || []).length;
console.log(`${dest}: header filled (${short}, #${t.first}–#${t.last}, ${t.merged} merged, +${k(t.additions)}/−${k(t.deletions)}); ${left} placeholders left to write`);
JS
