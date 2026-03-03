import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    mcp: 'src/mcp.ts',
  },
  format: ['esm'],
  target: 'node20',
  clean: true,
  splitting: false,
  sourcemap: true,
  dts: false,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
