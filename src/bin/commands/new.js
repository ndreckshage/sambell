/* eslint-disable no-console */

import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import copy from './lib/copy';

const cwd = process.cwd();

export default argv => {
  const { _: commands } = argv;
  const [, target] = commands;

  const targetFq = path.join(cwd, target);
  if (!target) return console.log(chalk.red('Must provide filename (index.js) or app name (my-app).'));
  if (!!~target.indexOf('/')) return console.log(chalk.red('No nested support with CLI.'));

  try {
    fs.accessSync(targetFq, fs.R_OK);
    return console.log(chalk.red(`${target} already exists.`));
  } catch (e) {} // eslint-disable-line

  if (targetFq.endsWith('.js')) {
    copy('index.js', targetFq);
    return console.log(chalk.green(`${target} created. sambell run ${target}`));
  }

  fs.mkdirSync(targetFq);
  copy('index.js', path.join(targetFq, 'index.js'));
  copy('package.json', path.join(targetFq, 'package.json'));
  copy('gerty.js', path.join(targetFq, 'gerty.js'));

  return console.log(chalk.green(`${target} created. cd ${target} && sambell run`));
};
