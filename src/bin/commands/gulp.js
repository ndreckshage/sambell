/* eslint-disable no-console */
import { spawn } from 'child_process';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

export default (argv, cmd) => {
  const {
    _: [, entry],
    gerty,
    env,
  } = argv;

  const cwd = process.cwd();
  const adjustedEnv = env || 'dev';
  const adjustedEntry = entry || 'index';
  const adjustedGerty = gerty || 'gerty';

  const args = [
    'run', 'gulp', cmd, '--',
    '--cwd', cwd,
    '--env', adjustedEnv,
    '--entry', adjustedEntry,
    '--gerty', adjustedGerty,
  ];

  let entryExists = false;
  try {
    fs.accessSync(path.join(cwd, adjustedEntry), fs.R_OK);
    entryExists = true;
  } catch (e) {
    try {
      fs.accessSync(path.join(cwd, `${adjustedEntry}.js`), fs.R_OK);
      entryExists = true;
    } catch (ee) {} // eslint-disable-line
  }

  if (entryExists) {
    spawn('npm', args, { stdio: 'inherit', cwd: __dirname });
  } else {
    console.log(chalk.red('No entry file found. Are you in correct directory?'));
    console.log(chalk.cyan('sambell run [entry]'));
  }
};
