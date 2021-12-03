import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'node:path';
import { rmSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';

try {
  rmSync(resolve('public', 'build'), { recursive: true });
  rmSync(resolve('public', '_metadata'), { recursive: true });
} catch {
  //
}

build({
  entryPoints: [
    resolve(__dirname, 'source', 'service_worker.js'),
    resolve(__dirname, 'source', 'links-popup.js'),
  ],
  bundle: true,
  minify: true,
  format: 'esm',
  splitting: true,
  watch: !isProd,
  sourcemap: isProd ? false : 'inline',
  target: ['chrome96'],
  outdir: resolve(__dirname, 'public', 'build'),
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
