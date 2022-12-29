import path from 'path';
import fs from 'fs';
import typescript from 'typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pluginTypescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

/**
 *
 * @returns {import('typescript').TranspileOptions}
 */
const getTsConfig = function (configPath) {
  const configJson = typescript.sys.readFile(configPath);
  return typescript.parseConfigFileTextToJson(configPath, configJson)
    .config;
};

const file = typescript.findConfigFile(
  './',
  typescript.sys.fileExists,
);
const config = getTsConfig(file);

// eslint-disable-next-line
const packageJson = JSON.parse(
  fs.readFileSync('./package.json', 'utf-8'),
);

const esmDir = path.dirname(packageJson.module);
const typesDir = path.dirname(packageJson.types);

/**
 * @type {import('rollup').RollupOptions[]}
 */
const options = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      pluginTypescript({ tsconfig: './tsconfig.json' }),
      postcss(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        dir: esmDir,
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      pluginTypescript({
        tsconfig: './tsconfig.json',
        tsconfigDefaults: {
          compilerOptions: {
            declaration: true,
            declarationDir: typesDir,
          },
        },
      }),
      postcss({
        extract: path.resolve(esmDir, 'styles.css'),
        minimize: true,
      }),
    ],
  },
];

export default options;
