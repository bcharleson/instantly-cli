import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    mcp: 'src/mcp.ts',
  },
  format: ['esm'],
  target: 'node18',
  clean: true,
  splitting: false,
  sourcemap: true,
  dts: false,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  // Keep @inquirer/prompts external so it's loaded dynamically at runtime
  // only when login/oauth commands need interactive prompts (requires Node 20+).
  // All other commands work on Node 18+.
  external: ['@inquirer/prompts'],
});
