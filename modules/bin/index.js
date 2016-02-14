#! /usr/bin/env node
/* eslint-disable no-console */

import { spawn } from 'child_process';
import minimist from 'minimist';
import chalk from 'chalk';
// import path from 'path';
// import fs from 'fs';

import { RUN } from './constants';

// const cwd = process.cwd();
const argv = minimist(process.argv.slice(2));
const { _: commands } = argv;
const [mainCommand] = commands;

if (mainCommand === RUN) {
  const { d } = argv;
  const development = !!d;

  if (development) {
    spawn('npm', ['run', 'gulp', '--', '--cwd', process.cwd()], { stdio: 'inherit', cwd: __dirname });
  } else {
    console.log(chalk.red('Only development supported.'));
  }
}
