#!/usr/bin/env node
import { context } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { rmSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

try {
  rmSync(path.resolve('public', 'build'), { recursive: true });
  rmSync(path.resolve('public', '_metadata'), { recursive: true });
} catch {
  //
}

const ctx = await context({
  entryPoints: [
    path.resolve(__dirname, 'source', 'service-worker.ts'),
    path.resolve(__dirname, 'source', 'links-popup.ts'),
  ],
  bundle: true,
  minify: false,
  format: 'esm',
  splitting: true,
  sourcemap: isProduction ? false : 'inline',
  target: ['chrome120', 'firefox120'],
  logLevel: 'info',
  legalComments: 'none',
  outdir: path.resolve(__dirname, 'public', 'build'),
}).catch((error) => {
  console.error(error);
  process.exit(1);
});

if (isProduction) {
  await ctx.rebuild();
  await ctx.dispose();
} else {
  await ctx.watch();
}
