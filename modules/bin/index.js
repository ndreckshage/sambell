#! /usr/bin/env node
/* eslint-disable no-console */

import { spawn } from 'child_process';
import minimist from 'minimist';
import chalk from 'chalk';
import { ncp } from 'ncp';
import path from 'path';
// import fs from 'fs';

import { RUN, NEW } from './constants';

const cwd = process.cwd();
const argv = minimist(process.argv.slice(2));
const { _: commands } = argv;
const [mainCommand] = commands;

if (mainCommand === NEW) {
  const [, target] = commands;
  const blueprint = path.join(__dirname, '..', '..', 'modules', 'blueprint');
  const destination = path.join(cwd, target);
  ncp(blueprint, destination, (err) => {
    if (err) {
      console.log(chalk.red(err));
    } else {
      console.log(chalk.green(`sambell DNA successfully copied to ${target}`));
      console.log(chalk.cyan(`cd ${target} && npm install && npm start`));
    }
  });
} else if (mainCommand === RUN) {
  const { d } = argv;
  const development = !!d;

  if (development) {
    spawn('npm', ['run', 'gulp', '--', '--cwd', process.cwd()], { stdio: 'inherit', cwd: __dirname });
  } else {
    console.log(chalk.red('Only development supported.'));
  }
}
