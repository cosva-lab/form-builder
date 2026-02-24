import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { run } = require('./copy-files.js');

/**
 * Tsdown plugin that runs the copy-files logic after each build.
 * Works with both single build and watch mode (runs after every rebuild).
 */
export function copyFilesPlugin() {
  return {
    name: 'copy-files',
    hooks: {
      'build:done': run as () => Promise<void>,
    },
  };
}
