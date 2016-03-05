/* eslint-disable no-console */

import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import copy from './lib/copy';
import { spawn } from 'child_process';
import packageJson from './../../../package.json';

const cwd = process.cwd();

const dependencies = [
  'babel-polyfill', 'chalk', 'domready', 'express',
  'ground-control', 'isomorphic-fetch', 'lodash', 'react',
  'react-dom', 'react-redux', 'react-router', 'react-router-redux',
  'redux', 'redux-loop', 'redux-thunk', 'source-map-support',
];

const installLocal = () => {
  const packages = [
    `sambell@${packageJson.version}`,
    ...dependencies.map(dep => `${dep}@${packageJson.dependencies[dep]}`),
  ];

  spawn('npm', ['i', '--save', ...packages], { stdio: 'inherit' });
};

const installDocker = () => {
  const currentDockerfile = path.join(cwd, 'Dockerfile');
  const currentDockerCompose = path.join(cwd, 'docker-compose.yml');
  const currentDockerIgnore = path.join(cwd, '.dockerignore');

  try {
    fs.accessSync(currentDockerfile, fs.R_OK);
    fs.accessSync(currentDockerCompose, fs.R_OK);
    fs.accessSync(currentDockerIgnore, fs.R_OK);
    return console.log(chalk.red(`Docker setup already exists.`));
  } catch (e) {} // eslint-disable-line

  copy('Dockerfile', path.join(cwd, 'Dockerfile'));
  copy('docker-compose.yml', path.join(cwd, 'docker-compose.yml'));
  copy('dockerignore', path.join(cwd, '.dockerignore'));
  return console.log(chalk.green(`Docker installed --> docker-compose build`));
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
    `eslint@${packageJson.devDependencies.eslint}`,
    `eslint-config-airbnb@${packageJson.devDependencies['eslint-config-airbnb']}`,
    `eslint-plugin-react@${packageJson.devDependencies['eslint-plugin-react']}`,
    `babel-eslint@${packageJson.dependencies['babel-eslint']}`,
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

  copy('gitignore', path.join(cwd, '.gitignore'));
  spawn('git', ['init', '.'], { stdio: 'inherit' });
  return console.log(chalk.green(`.gitignore installed & git initialized.`));
};

export default argv => {
  const { all, local, git, eslint, docker } = argv;

  if (all || local) installLocal();
  if (all || git) installGit();
  if (all || eslint) installEslint();
  if (all || docker) installDocker();
};
