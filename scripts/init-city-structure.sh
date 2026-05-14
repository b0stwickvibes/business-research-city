#!/usr/bin/env bash
# Creates cities/<slug>/ skeleton matching business-research-city README layout.
# Usage: ./scripts/init-city-structure.sh san-francisco
set -euo pipefail

SLUG_RAW="${1:-}"
if [[ -z "${SLUG_RAW}" ]]; then
  echo "Usage: $(basename "$0") <city-slug>" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SLUG="$(echo "${SLUG_RAW}" | tr '[:upper:]' '[:lower:]' | tr -s ' ' '-' | sed 's/^-//' | sed 's/-$//')"
CITY_ROOT="${ROOT}/cities/${SLUG}"

if [[ -d "${CITY_ROOT}" ]]; then
  echo "Directory already exists: ${CITY_ROOT}" >&2
  exit 1
fi

mkdir -p "${CITY_ROOT}/playbooks" \
  "${CITY_ROOT}/data/scrapes/pdp" \
  "${CITY_ROOT}/data/inventory" \
  "${CITY_ROOT}/data/receipts" \
  "${CITY_ROOT}/_intake"

EXAMPLE="${ROOT}/cities/_intake/example.request.yaml"
if [[ -f "${EXAMPLE}" ]] && [[ ! -f "${CITY_ROOT}/_intake/request.yaml" ]]; then
  cp "${EXAMPLE}" "${CITY_ROOT}/_intake/request.yaml"
fi

echo "Created ${CITY_ROOT}"
echo "Next: edit _intake/request.yaml, then run /business-research-city from the control center Research wizard."
