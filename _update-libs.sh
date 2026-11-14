#!/usr/bin/env bash

set -e

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "${SCRIPT_DIR}"

LIBS=""
#
LIBS=" $LIBS @mui/icons-material@latest"
LIBS=" $LIBS @mui/lab@latest"
LIBS=" $LIBS @mui/material-nextjs@latest"
LIBS=" $LIBS @mui/material@latest"
LIBS=" $LIBS @mui/system@latest"
LIBS=" $LIBS @mui/x-data-grid@latest"
LIBS=" $LIBS @mui/x-date-pickers@latest"
LIBS=" $LIBS @mui/x-tree-view@latest"
LIBS=" $LIBS globals@latest"
LIBS=" $LIBS next@latest"
LIBS=" $LIBS tsdown@latest"

pnpm up -r ${LIBS}
