/* eslint-disable no-console, handle-callback-err */

import gulp from 'gulp';
import webpack from 'webpack';
import nodemon from 'nodemon';
import minimist from 'minimist';
import path from 'path';
import chalk from 'chalk';
import gutil from 'gutil';
import fs from 'fs';

import clientConfig from './config.client';
import serverConfig from './config.server';

import { SERVER_OUTPUT_DIR, SERVER_FILENAME } from './constants';

const WATCH_MS = 100;
const TASK_DEFAULT = 'default';
const TASK_CLIENT = 'webpack-client';
const TASK_SERVER = 'webpack-server';

const argv = minimist(process.argv.slice(2));
const { cwd: ORIGINAL_CWD } = argv;

const gertyPath = `${ORIGINAL_CWD}/gerty.js`;
let gertyExists = false;
try {
  fs.accessSync(gertyPath, fs.R_OK);
  gertyExists = true;
} catch (e) {} // eslint-disable-line

const webpackWatch = (config, task, done) => {
  let firedDone = false;
  webpack({
    ...config,
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({
        __GERTY_EXISTS__: JSON.stringify(gertyExists),
        __GERTY_PATH__: JSON.stringify(gertyPath),
      }),
    ],
  }).watch(WATCH_MS, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log(chalk.green(`[${task}]`), stats.toString());
    if (!firedDone) {
      firedDone = true;
      done();
    }
  });
};

const nodemonOpts = { execMap: { js: 'node' }, ignore: ['*'], watch: ['foo/'], ext: 'noop' };
const startServer = () => {
  const script = path.join(__dirname, '..', SERVER_OUTPUT_DIR, SERVER_FILENAME);
  nodemon({ ...nodemonOpts, script }).on('restart', () => {
    console.log(chalk.magenta('Restart server...'));
  });
};

gulp.task(TASK_CLIENT, done => webpackWatch(clientConfig, TASK_CLIENT, done));
gulp.task(TASK_SERVER, done => webpackWatch(serverConfig, TASK_SERVER, done));
gulp.task(TASK_DEFAULT, [TASK_SERVER, TASK_CLIENT], startServer);
