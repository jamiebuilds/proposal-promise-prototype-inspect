#!/bin/sh

set -e

BUILD_DIR=`mktemp -dt ecmascript-promise-getvalue` || exit 1
trap "rm -rf $BUILD_DIR" EXIT
mkdir "$BUILD_DIR/out"

./node_modules/.bin/ecmarkup \
  spec.emu \
  "$BUILD_DIR/out/index.html" \
  --js "$BUILD_DIR/out/spec.js" \
  --css "$BUILD_DIR/out/spec.css"

# Replace gh-pages with a new commit without touching the working directory.
GIT_WORK_TREE="$BUILD_DIR/out" GIT_INDEX_FILE="$BUILD_DIR/index" \
  git add index.html spec.js spec.css
TREE=`GIT_WORK_TREE="$BUILD_DIR/out" GIT_INDEX_FILE="$BUILD_DIR/index" \
  git write-tree`
COMMIT=`git commit-tree "$TREE" -m 'build gh-pages'`
git branch -f gh-pages $COMMIT
