/* eslint-disable no-console */

import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import copy from './lib/copy';
import { spawn } from 'child_process';

const cwd = process.cwd();

const installLocal = () => {
  return console.log(chalk.red('Coming soon.'));
};

const installBabel = () => {
  return console.log(chalk.red(`Coming soon.`));
};

const installDocker = () => {
  return console.log(chalk.red('Coming soon.'));
};

const installEslint = () => {
  const currentEslint = path.join(cwd, '.eslintrc');
  try {
    fs.accessSync(currentEslint, fs.R_OK);
    return console.log(chalk.red(`.eslintc already exists.`));
  } catch (e) {} // eslint-disable-line

  copy('.eslintrc', path.join(cwd, '.eslintrc'));
  const eslintOpts = [
    'i', '--save-dev',
    'eslint@1.10.3',
    'eslint-config-airbnb@5.0.1',
    'eslint-plugin-react@3.16.1',
    'babel-eslint@4.1.8',
  ];

  spawn('npm', eslintOpts, { stdio: 'inherit' });
  return console.log(chalk.green(`.eslintc installed.`));
};

const installGit = () => {
  const currentGitIgnore = path.join(cwd, '.gitignore');
  try {
    fs.accessSync(currentGitIgnore, fs.R_OK);
    return console.log(chalk.red(`.gitignore already exists.`));
  } catch (e) {} // eslint-disable-line

  copy('.gitignore', path.join(cwd, '.gitignore'));
  spawn('git', ['init', '.'], { stdio: 'inherit' });
  return console.log(chalk.green(`.gitignore installed & git initialized.`));
};

export default argv => {
  const {
    local, git, eslint,
    babel, docker,
  } = argv;

  if (local) installLocal();
  if (git) installGit();
  if (eslint) installEslint();
  if (babel) installBabel();
  if (docker) installDocker();
};
