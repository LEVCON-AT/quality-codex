#!/bin/bash
# Doublet-Sweep: identische Function/Type-Signaturen finden
set -e

ROOT=$(pwd)
SRC_DIRS=(packages/*/src)

echo "▶ Checking for duplicate function signatures..."
DUP_FUNCS=$(grep -rhn '^export function\|^export const' "${SRC_DIRS[@]}" 2>/dev/null \
  | awk -F: '{print $NF}' \
  | grep -oP '^export (function|const) \K\w+' \
  | sort | uniq -d || true)

if [ -n "$DUP_FUNCS" ]; then
  echo "⚠ Possible duplicate exports:"
  echo "$DUP_FUNCS" | while read name; do
    echo "  - $name:"
    grep -rn "^export \(function\|const\) $name" "${SRC_DIRS[@]}" || true
  done
  exit 1
fi

echo "▶ Checking for duplicate type definitions..."
DUP_TYPES=$(grep -rhn '^export type\|^export interface' "${SRC_DIRS[@]}" 2>/dev/null \
  | awk -F: '{print $NF}' \
  | grep -oP '^export (type|interface) \K\w+' \
  | sort | uniq -d || true)

if [ -n "$DUP_TYPES" ]; then
  echo "⚠ Possible duplicate types:"
  echo "$DUP_TYPES"
  exit 1
fi

echo "✓ No obvious doublets found"
