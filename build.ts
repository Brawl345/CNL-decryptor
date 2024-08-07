#!/usr/bin/env node
/* eslint-disable unicorn/prefer-top-level-await */
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { rmSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

try {
  rmSync(resolve('public', 'build'), { recursive: true });
  rmSync(resolve('public', '_metadata'), { recursive: true });
} catch {
  //
}

build({
  entryPoints: [resolve(__dirname, 'source', 'service-worker.ts'), resolve(__dirname, 'source', 'links-popup.ts')],
  bundle: true,
  minify: false,
  format: 'esm',
  splitting: true,
  watch: !isProduction,
  sourcemap: isProduction ? false : 'inline',
  target: ['chrome120', 'firefox120'],
  logLevel: 'info',
  legalComments: 'none',
  outdir: resolve(__dirname, 'public', 'build'),
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
