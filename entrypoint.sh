#!/bin/sh
set -e

mkdir -p /app/static

if [ ! -f /app/static/speedtest ]; then
  echo "generating 100mb speedtest file"
  dd if=/dev/urandom of=/app/static/speedtest-100m bs=1M count=100
fi

exec node build