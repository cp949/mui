#!/usr/bin/env bash
# 빌드 산출물과 의존성 폴더를 삭제한다. (구 _purge.sh 대체)
#
# 사용법: ./clean.sh [--dry-run]
#   --dry-run  삭제하지 않고 대상만 출력
#
# 삭제 대상: 루트, apps/*, sub/* 바로 아래의 폴더만 해당한다.
#   node_modules, .turbo, dist, dist-react*, playwright-report, test-results
# src 등 하위 폴더는 탐색하지 않는다. (이름이 같은 소스 폴더 오삭제 방지)
# 삭제 후 `pnpm install`로 의존성을 다시 설치해야 한다.

set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd -- "$SCRIPT_DIR"
readonly REPO_ROOT="$SCRIPT_DIR"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
elif [[ $# -gt 0 ]]; then
  printf 'usage: %s [--dry-run]\n' "$(basename "$0")" >&2
  exit 2
fi

# 탐색 깊이: 루트 바로 아래(1)부터 <apps|sub>/<패키지>/<대상 폴더>(3)까지
removed=0
while IFS= read -r -d '' path; do
  relative_path="${path#"$REPO_ROOT/"}"
  if [[ "$DRY_RUN" == true ]]; then
    printf '[dry-run] %s\n' "$relative_path"
  else
    rm -rf -- "$path"
    printf 'removed %s\n' "$relative_path"
  fi
  ((removed += 1))
done < <(
  find "$REPO_ROOT" -mindepth 1 -maxdepth 3 \
    -path "$REPO_ROOT/.git" -prune -o \
    -type d \( \
      -name node_modules \
      -o -name .turbo \
      -o -name dist \
      -o -name 'dist-react*' \
      -o -name playwright-report \
      -o -name test-results \
    \) -prune -print0
)

if [[ "$DRY_RUN" == true ]]; then
  printf 'would remove %d directories\n' "$removed"
else
  printf 'removed %d directories\n' "$removed"
fi
