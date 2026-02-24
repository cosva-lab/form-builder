import path from 'path';
import fs from 'fs';
import { defineConfig } from 'rolldown';
import pluginTypescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const packageJson = JSON.parse(
  fs.readFileSync('./package.json', 'utf-8'),
);

const mainDir = path.dirname(packageJson.main);
const moduleDir = path.dirname(packageJson.module);
const esmDir = path.dirname(packageJson.esnext);
const typesDir = path.dirname(packageJson.types);

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        dir: moduleDir,
        format: 'es',
        sourcemap: true,
        preserveModules: true,
      },
      {
        dir: mainDir,
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
      },
      {
        dir: esmDir,
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    plugins: [
      pluginTypescript({
        tsconfig: './tsconfig.json',
        tsconfigDefaults: {
          compilerOptions: {
            declaration: true,
            declarationDir: typesDir,
          },
        },
      }),
      peerDepsExternal(),
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
  },
]);
