/* eslint-disable no-console, handle-callback-err */

import gulp from 'gulp';
import webpack from 'webpack';
import nodemon from 'nodemon';
import path from 'path';
import chalk from 'chalk';
import gutil from 'gutil';

import clientConfig from './config.client';
import serverConfig from './config.server';

const WATCH_MS = 100;
const TASK_DEFAULT = 'default';
const TASK_CLIENT = 'webpack-client';
const TASK_SERVER = 'webpack-server';

const webpackWatch = (config, task, done) => {
  let firedDone = false;
  webpack(config).watch(WATCH_MS, (err, stats) => {
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
  const script = path.join(__dirname, '..', 'public', 'server.js');
  nodemon({ ...nodemonOpts, script }).on('restart', () => {
    console.log(chalk.magenta('Restart server...'));
  });
};

gulp.task(TASK_CLIENT, done => webpackWatch(clientConfig, TASK_CLIENT, done));
gulp.task(TASK_SERVER, done => webpackWatch(serverConfig, TASK_SERVER, done));
gulp.task(TASK_DEFAULT, [TASK_SERVER, TASK_CLIENT], startServer);
