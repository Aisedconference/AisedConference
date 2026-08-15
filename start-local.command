#!/bin/sh

cd "$(dirname "$0")" || exit 1

if command -v node >/dev/null 2>&1; then
  exec node server.js
fi

echo "Node.js was not found. Starting the static preview with Python instead."
exec python3 -m http.server 8080
