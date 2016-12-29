#!/usr/bin/env node
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const fs = require('fs');
const ncp = require('ncp').ncp;
const chalk = require('chalk');
const { _: [command] } = argv;
const packageJson = require('./../package.json');

const spawn = require('child_process').spawn;
const path = require('path');

if (command === 'run') {
  spawn('node', [path.resolve(__dirname, '..', 'scripts/run.js')], { stdio: 'inherit' });
} else if (command === 'build') {
  spawn('node', [path.resolve(__dirname, '..', 'scripts/build.js')], { stdio: 'inherit' });
} else if (command === 'new') {
  console.log(chalk.green('Cloning...'));
  const { _: [, dest] } = argv;
  const finalDest = path.resolve(process.cwd(), dest);
  ncp(path.resolve(__dirname, '..', 'template'), finalDest, function (err) {
   if (err) return console.error(err);
   try {
     fs.renameSync(path.resolve(finalDest, '.npmignore'), path.resolve(finalDest, '.gitignore'));
   } catch (e) {} // if no .npmignore, already .gitignore
   process.chdir(finalDest);
   spawn('yarn', ['install'], { stdio: 'inherit' });
  });
} else if (!command && (argv.v || argv.version)) {
  console.log(chalk.cyan(`sambell ${packageJson.version}`));
} else {
  console.log(chalk.red('Valid commands: run; build; new'));
}
