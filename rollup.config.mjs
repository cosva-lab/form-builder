import path from 'path';
import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pluginTypescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';

const packageJson = JSON.parse(
  fs.readFileSync('./package.json', 'utf-8'),
);

const mainDir = path.dirname(packageJson.main);
const moduleDir = path.dirname(packageJson.module);
const esmDir = path.dirname(packageJson.esnext);
const typesDir = path.dirname(packageJson.types);

/**
 * @type {import('rollup').RollupOptions[]}
 */
const options = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/umd/form-builder-development.js',
        format: 'umd',
        sourcemap: true,
        name: 'FormBuilder',
      },
      {
        file: 'dist/umd/form-builder-production.min.js',
        format: 'umd',
        sourcemap: true,
        name: 'FormBuilder',
        plugins: [terser()],
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      pluginTypescript({ tsconfig: './tsconfig.json' }),
      postcss({ extract: true, minimize: true }),
    ],
  },
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
        interop: 'auto',
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
];

export default options;
