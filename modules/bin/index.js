#! /usr/bin/env node
/* eslint-disable no-console */

import { spawn } from 'child_process';
import minimist from 'minimist';
import chalk from 'chalk';
import path from 'path';

import defaults from './gerty';
import { RUN } from './constants';

const cwd = process.cwd();
const argv = minimist(process.argv.slice(2));
const { _: commands } = argv;
const [mainCommand] = commands;

if (mainCommand === RUN) {
  const { d } = argv;
  const development = !!d;
  const options = require(path.join(cwd, 'gerty.json'));
  const settings = { ...defaults, ...options }; // eslint-disable-line

  if (development) {
    spawn('npm', ['run', 'gulp'], { stdio:'inherit', cwd: __dirname });
  } else {
    console.log(chalk.red('Only development supported.'));
  }
}
