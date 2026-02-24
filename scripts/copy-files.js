/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');

const packagePath = process.cwd();
const buildPath = path.join(packagePath, './dist');
const esmPath = path.join(buildPath, 'esm');

async function includeFileInBuild(file) {
  const sourcePath = path.resolve(packagePath, file);
  const targetPath = path.resolve(buildPath, path.basename(file));
  await fse.copy(sourcePath, targetPath);
  console.log(`Copied ${sourcePath} to ${targetPath}`);
}

function mkDirByPathSync(targetDir, { recursive = false } = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : __dirname;
  const baseDir = recursive ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir, { recursive: true });
    } catch (err) {
      if (err.code === 'EEXIST') {
        // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(
          `EACCES: permission denied, mkdir '${parentDir}'`,
        );
      }

      const caughtErr =
        ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (
        !caughtErr ||
        (caughtErr && curDir === path.resolve(targetDir))
      ) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

try {
  mkDirByPathSync(buildPath);
} catch {}

/**
 * Puts a package.json into every directory that has index.mjs (esm build).
 * That package.json contains information for bundlers so that deep imports
 * are tree-shakeable. Also checks that index.d.mts exists.
 */
async function createModulePackages({ from }) {
  const indexFiles = glob.sync('**/index.mjs', { cwd: from });

  await Promise.all(
    indexFiles.map(async (indexFile) => {
      const directoryPackage = path.dirname(indexFile);
      const packageJsonPath = path.join(from, directoryPackage, 'package.json');
      const typingsPath = path.join(from, directoryPackage, 'index.d.mts');
      const typingsExist = await fse.exists(typingsPath);

      const packageJson = {
        sideEffects: false,
        module: './index.mjs',
        ...(typingsExist && { typings: './index.d.mts' }),
      };

      await fse.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
      );

      return packageJsonPath;
    }),
  );
}

async function typescriptCopy({ from, to }) {
  if (!(await fse.exists(to))) {
    console.warn(`path ${to} does not exists`);
    return [];
  }
  const files = glob.sync('**/*+(.ts|.d.ts)', { cwd: from });

  const cmds = files.map((file) =>
    fse.copy(path.resolve(from, file), path.resolve(to, file)),
  );
  return Promise.all(cmds);
}

async function createPackageFile() {
  const packageData = await fse.readFile(
    path.resolve(packagePath, './package.json'),
    'utf8',
  );

  const relative = (p) =>
    path.relative(buildPath, p).replace(/\\/g, '/');

  const {
    nyc,
    scripts,
    devDependencies,
    workspaces,
    ...packageDataOther
  } = JSON.parse(packageData);
  const newPackageData = {
    ...packageDataOther,
    private: false,
    main: relative(packageDataOther.main),
    module: relative(packageDataOther.module),
    esnext: relative(packageDataOther.esnext),
    types: relative(packageDataOther.types),
  };
  const targetPath = path.resolve(buildPath, './package.json');

  await fse.writeFile(
    targetPath,
    JSON.stringify(newPackageData, null, 2),
    'utf8',
  );
  console.log(`Created package.json in ${targetPath}`);

  return newPackageData;
}

async function prepend(file, string) {
  const data = await fse.readFile(file, 'utf8');
  if (data.startsWith('/** @license')) return;
  await fse.writeFile(file, string + data, 'utf8');
}

async function addLicense(packageData) {
  const license = `/** @license Form-builder v${packageData.version}
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
`;
  const entryFiles = [
    './cjs/index.cjs',
    './es/index.mjs',
    './esm/index.mjs',
  ];
  await Promise.all(
    entryFiles.map(async (file) => {
      try {
        await prepend(path.resolve(buildPath, file), license);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`Skipped license for ${file}`);
        } else {
          throw err;
        }
      }
    }),
  );
}

async function run() {
  try {
    if (!(await fse.exists(esmPath))) {
      return;
    }
    const packageData = await createPackageFile();

    await Promise.all(
      ['./README.md', '../../CHANGELOG.md', '../../LICENSE'].map(
        (file) => includeFileInBuild(file).catch(() => {}),
      ),
    );

    await addLicense(packageData);

    await createModulePackages({ from: esmPath });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = { run };
