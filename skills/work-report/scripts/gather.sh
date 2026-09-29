#!/usr/bin/env bash
# work-report, step 1: collect the raw material for a PR range.
#
#   scripts/gather.sh <first-pr> [last-pr] <out-dir>
#
# Run from inside the project's git checkout. Needs: gh (authenticated), jq, git.
# The base branch is the repo's default branch unless BASE=<branch> is set.
#
# Writes into <out-dir>:
#   index.tsv        number, state, merged-at, +adds, -dels, files, title   (by PR number)
#   prs/<n>.md       title + full body of every PR in range, merged AND closed
#   totals.json      {"merged":N,"closed":N,"additions":N,"deletions":N,"first":N,"last":N,
#                     "from":"YYYY-MM-DD","to":"YYYY-MM-DD","repo":"owner/name","repoUrl":"…"}
#   before-sha.txt   first parent of the EARLIEST-MERGED PR's merge commit: the "before" checkout
#   after-sha.txt    the base branch tip on origin: the "after" checkout
set -euo pipefail

die() { echo "gather.sh: $*" >&2; exit 1; }
for bin in gh jq git; do command -v "$bin" >/dev/null || die "$bin is not installed"; done
git rev-parse --git-dir >/dev/null 2>&1 || die "run this from inside the project's git checkout"
gh auth status >/dev/null 2>&1 || die "gh is not authenticated (gh auth login)"

[ $# -ge 2 ] || die "usage: gather.sh <first-pr> [last-pr] <out-dir>"
first=$1
if [ $# -ge 3 ]; then last=$2; out=$3; else last=999999999; out=$2; fi
[[ "$first" =~ ^[0-9]+$ && "$last" =~ ^[0-9]+$ ]] || die "PR numbers must be integers"
mkdir -p "$out/prs"

repo_json=$(gh repo view --json nameWithOwner,url,defaultBranchRef)
repo=$(jq -r .nameWithOwner <<<"$repo_json")
repo_url=$(jq -r .url <<<"$repo_json")
base=${BASE:-$(jq -r .defaultBranchRef.name <<<"$repo_json")}

# gh's list is newest-first and capped; fetch enough to reach back to <first>.
newest=$(gh pr list --state all --limit 1 --json number --jq '.[0].number // 0')
limit=$(( newest - first + 50 )); [ "$limit" -lt 100 ] && limit=100

gh pr list --state all --limit "$limit" \
  --json number,title,state,mergedAt,closedAt,additions,deletions,changedFiles,mergeCommit,baseRefName \
  --jq "[.[] | select(.number >= $first and .number <= $last)] | sort_by(.number)" > "$out/raw.json"

count=$(jq length "$out/raw.json")
[ "$count" -gt 0 ] || die "no PRs found in #$first..#$last in $repo"

jq -r '.[] | [.number, .state, (.mergedAt // "-"), "+\(.additions)", "-\(.deletions)", "\(.changedFiles)f", .title] | @tsv' \
  "$out/raw.json" > "$out/index.tsv"

jq --arg repo "$repo" --arg url "$repo_url" '
  [.[] | select(.state == "MERGED")] as $m |
  {
    merged: ($m | length),
    closed: ([.[] | select(.state == "CLOSED")] | length),
    open: ([.[] | select(.state == "OPEN")] | length),
    additions: ($m | map(.additions) | add // 0),
    deletions: ($m | map(.deletions) | add // 0),
    first: (map(.number) | min), last: (map(.number) | max),
    from: ($m | map(.mergedAt) | min // "" | .[0:10]),
    to:   ($m | map(.mergedAt) | max // "" | .[0:10]),
    repo: $repo, repoUrl: $url
  }' "$out/raw.json" > "$out/totals.json"

for n in $(jq -r '.[].number' "$out/raw.json"); do
  gh pr view "$n" --json title,body --jq '.title + "\n\n" + (.body // "")' > "$out/prs/$n.md"
done

git fetch -q origin "$base"
earliest=$(jq -r '[.[] | select(.state == "MERGED")] | sort_by(.mergedAt) | .[0].mergeCommit.oid // empty' "$out/raw.json")
if [ -n "$earliest" ]; then
  # A squash merge has one parent, so ^1 is still "main just before this PR".
  git rev-parse "$earliest^1" > "$out/before-sha.txt"
else
  echo "gather.sh: no merged PRs in range; before-sha.txt not written" >&2
fi
git rev-parse "origin/$base" > "$out/after-sha.txt"

cat "$out/index.tsv"
echo
jq -r '"\(.repo): \(.merged) merged, \(.closed) closed, \(.open) open · +\(.additions) / -\(.deletions) · \(.from) → \(.to)"' "$out/totals.json"
[ -f "$out/before-sha.txt" ] && echo "before: $(git log -1 --format='%h %s' "$(cat "$out/before-sha.txt")")"
echo "after:  $(git log -1 --format='%h %s' "$(cat "$out/after-sha.txt")")"
echo "open PRs in range are listed but not counted; a report covers what merged."
