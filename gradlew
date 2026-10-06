#!/bin/sh
set -eu
ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
GRADLE_VERSION=8.9
DIST="$ROOT_DIR/.gradle-dist/gradle-$GRADLE_VERSION"
if [ -x "$DIST/bin/gradle" ]; then
  exec "$DIST/bin/gradle" "$@"
fi
ZIP="$ROOT_DIR/.gradle-dist/gradle-$GRADLE_VERSION-bin.zip"
mkdir -p "$ROOT_DIR/.gradle-dist"
if [ ! -f "$ZIP" ]; then
  if command -v curl >/dev/null 2>&1; then
    curl -fL --retry 3 "https://services.gradle.org/distributions/gradle-$GRADLE_VERSION-bin.zip" -o "$ZIP"
  elif command -v wget >/dev/null 2>&1; then
    wget -O "$ZIP" "https://services.gradle.org/distributions/gradle-$GRADLE_VERSION-bin.zip"
  else
    echo "Gradle 8.9 is required. Install curl or wget to bootstrap the distribution." >&2
    exit 1
  fi
fi
command -v unzip >/dev/null 2>&1 || { echo "unzip is required to bootstrap Gradle 8.9." >&2; exit 1; }
unzip -q -o "$ZIP" -d "$ROOT_DIR/.gradle-dist"
exec "$DIST/bin/gradle" "$@"
