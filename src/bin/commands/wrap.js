/* eslint-disable no-console */

import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import copy from './lib/copy';

const cwd = process.cwd();

export default argv => {
  const { _: commands } = argv;
  const [, current, target] = commands;

  const currentFq = path.join(cwd, current);
  try {
    fs.accessSync(currentFq, fs.R_OK);
  } catch (e) {
    return console.log(chalk.red(`${current} doesn't exist.`));
  } // eslint-disable-line

  const adjustedTarget = target || current.split('.js')[0];
  const targetFq = path.join(cwd, adjustedTarget);
  if (!!~adjustedTarget.indexOf('/')) return console.log(chalk.red('No nested support with CLI.'));
  try {
    fs.accessSync(targetFq, fs.R_OK);
    return console.log(chalk.red(`${adjustedTarget} already exists.`));
  } catch (e) {} // eslint-disable-line

  fs.mkdirSync(targetFq);
  copy(currentFq, path.join(targetFq, 'index.js'), false);
  fs.unlinkSync(currentFq);
  copy('package.json', path.join(targetFq, 'package.json'));
  copy('gerty.js', path.join(targetFq, 'gerty.js'));
  return console.log(chalk.green(`${current} wrapped. cd ${target} && sambell run`));
};
