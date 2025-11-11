#!/bin/sh
set -e

mkdir -p /app/build/static
dd if=/dev/urandom of=/app/build/static/speedtest-100m bs=1M count=100

exec node build