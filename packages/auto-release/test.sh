#!/bin/sh

pnpm build
pnpm publish
npm install -g @nutint/auto-release
npx auto-release --config-file=auto-release.config.json

