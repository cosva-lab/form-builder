import path from 'path';
import fs from 'fs';
import { defineConfig } from 'tsdown';
import postcss from 'rollup-plugin-postcss';

const packageJson = JSON.parse(
  fs.readFileSync('./package.json', 'utf-8'),
);

const mainDir = path.dirname(packageJson.main);
const moduleDir = path.dirname(packageJson.module);
const esmDir = path.dirname(packageJson.esnext);
const typesDir = path.dirname(packageJson.types);

const plugins = [
  postcss({
    extract: 'index.css',
    minimize: true,
  }),
];

const exclude = ['!src/**/*.spec.ts', '!src/**/*.test.ts'];
export default defineConfig([
  {
    entry: ['src/**/*.ts', ...exclude],
    format: ['cjs'],
    outDir: mainDir,
    dts: true,
    clean: true,
    unbundle: true,
    plugins,
  },
  {
    entry: ['src/**/*.ts', ...exclude],
    format: ['esm'],
    outDir: esmDir,
    dts: true,
    clean: true,
    unbundle: true,
    plugins,
  },
  {
    entry: ['src/**/*.ts', ...exclude],
    format: ['module'],
    outDir: moduleDir,
    dts: true,
    clean: true,
    unbundle: true,
    plugins,
  },
]);
