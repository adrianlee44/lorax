#!/usr/bin/env bash
#
# Publish a new version of lorax.
#
# Usage: scripts/publish.sh [-n|--dry-run] <major|minor|patch>
#
# With --dry-run the version bump and changelog are generated so they can be
# reviewed, then reverted. Nothing is committed, tagged, pushed or published.

set -euo pipefail

usage() {
  echo "Usage: $0 [-n|--dry-run] <major|minor|patch>" >&2
  exit 1
}

DRY_RUN=0
TYPE=""

for arg in "$@"; do
  case "$arg" in
    -n | --dry-run) DRY_RUN=1 ;;
    major | minor | patch) TYPE="$arg" ;;
    *) usage ;;
  esac
done

[[ -n "$TYPE" ]] || usage

cd "$(dirname "$0")/.."

# Run a command, or only print it in dry run mode
run() {
  if ((DRY_RUN)); then
    echo "[dry-run] $*"
  else
    "$@"
  fi
}

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working tree is not clean" >&2
  exit 1
fi

# Compute the next version without touching any files
CURRENT="$(node -p "require('./package.json').version")"
IFS=. read -r MAJOR MINOR PATCH <<<"$CURRENT"
case "$TYPE" in
  major) VERSION="$((MAJOR + 1)).0.0" ;;
  minor) VERSION="${MAJOR}.$((MINOR + 1)).0" ;;
  patch) VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))" ;;
esac
TAG="v${VERSION}"

if git rev-parse -q --verify "refs/tags/${TAG}" >/dev/null ||
  [[ -n "$(git ls-remote --tags origin "refs/tags/${TAG}")" ]]; then
  echo "Error: tag ${TAG} already exists" >&2
  exit 1
fi

echo "Releasing ${CURRENT} -> ${VERSION}"

if ((DRY_RUN)); then
  # The tree was clean, so restoring tracked files undoes the preview
  trap 'git checkout -- package.json package-lock.json changelog.md' EXIT
fi

# Update package.json (and package-lock.json) only
npm version "$VERSION" --no-git-tag-version >/dev/null

# Generate the changelog with the local build of lorax
npm run compile
node bin/lorax -t "$TAG" -p

if ((DRY_RUN)); then
  git --no-pager diff --stat
  git --no-pager diff -- changelog.md
fi

run git add package.json package-lock.json changelog.md
run git commit -m "chore(build): v${VERSION} build"
run git tag "$TAG"

run git push origin HEAD
run git push origin "$TAG"

# prepublishOnly compiles the package
if ((DRY_RUN)); then
  npm publish --dry-run
else
  npm publish
fi

if ((DRY_RUN)); then
  echo "Dry run complete, changes reverted"
else
  echo "Published lorax ${TAG}"
fi
