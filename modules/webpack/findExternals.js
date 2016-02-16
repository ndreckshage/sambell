import fs from 'fs';
import path from 'path';

const basePath = path.join(__dirname, '..', '..');
const baseNodeModulesPath = path.join(basePath, 'node_modules');
const parentNodeModulesPath = path.join(basePath, '..');

let baseNodeModulesExists = false;
let parentNodeModulesExists = false;

try {
  fs.accessSync(baseNodeModulesPath, fs.R_OK);
  baseNodeModulesExists = true;
} catch (e) {} // eslint-disable-line

try {
  fs.accessSync(parentNodeModulesPath, fs.R_OK);
  parentNodeModulesExists = true;
} catch (e) {} // eslint-disable-line

const filterBin = x => !~['.bin'].indexOf(x);

export default () => {
  const externals = {};
  const normalizeExternals = mod => externals[mod] = `commonjs ${mod}`;

  let nodeModules = [];
  if (baseNodeModulesExists) nodeModules = nodeModules.concat(fs.readdirSync(baseNodeModulesPath));
  if (parentNodeModulesExists) nodeModules = nodeModules.concat(fs.readdirSync(parentNodeModulesPath));
  nodeModules.filter(filterBin).forEach(normalizeExternals);

  return externals;
};
