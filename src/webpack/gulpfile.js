/* eslint-disable no-console, handle-callback-err */

import gulp from 'gulp';
import webpack from 'webpack';
import nodemon from 'nodemon';
import minimist from 'minimist';
import path from 'path';
import chalk from 'chalk';
import gutil from 'gutil';
import fs from 'fs';

import webpackClientConfig from './config.client';
import webpackServerConfig from './config.server';

import { setConstants } from './shared';
import { SERVER_OUTPUT_DIR, SERVER_FILENAME, APP_DIR } from './constants';

const TASK_DEFAULT = 'default';
const TASK_CLIENT = 'webpack-client';
const TASK_SERVER = 'webpack-server';

const argv = minimist(process.argv.slice(2));
const { env, cwd, entry, gerty } = argv;

const samBellRoot = path.join(__dirname, '..', '..');
const samBellModules = path.join(samBellRoot, 'node_modules');
const samBellBuild = path.join(samBellRoot, 'build');
const samBellApp = path.join(samBellBuild, APP_DIR);

switch (env) {
  case 'd':
  case 'dev':
  case 'development':
    process.env.NODE_ENV = 'development';
    break;
  case 'p':
  case 'prod':
  case 'production':
    process.env.NODE_ENV = 'production';
    break;
  default:
    process.env.NODE_ENV = env;
}

let gertyPath = null;
try {
  fs.accessSync(path.join(cwd, `${gerty}${gerty.endsWith('.js') ? '' : '.js'}`), fs.R_OK);
  gertyPath = gerty;
} catch (e) {} // eslint-disable-line

let cliAppOptions = {
  __GERTY_ENV__: JSON.stringify(env),
  __GERTY_ENTRY__: JSON.stringify(entry),
  __GERTY_PATH__: JSON.stringify(gertyPath),
};

const webpackWatch = (config, task, done) => {
  let firedDone = false;
  cliAppOptions = {
    ...cliAppOptions,
    __CLIENT__: JSON.stringify(task === TASK_CLIENT),
    __SERVER__: JSON.stringify(task === TASK_SERVER),
  };

  const compiler = webpack({
    ...config,
    resolve: {
      root: [samBellModules, samBellBuild, cwd],
      alias: { sambell: samBellApp },
    },
    resolveLoader: { root: [samBellModules] },
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin(setConstants()),
      new webpack.DefinePlugin(cliAppOptions),
    ],
  });

  const cb = (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    const jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) gutil.log(chalk.red(jsonStats.errors));
    if (jsonStats.warnings.length > 0) gutil.log(chalk.yellow(jsonStats.warnings));
    if (jsonStats.errors.length === 0 && jsonStats.warnings.length === 0) gutil.log(chalk.green(`[${task}]`), stats.toString());
    if (task === TASK_SERVER) nodemon.restart();

    if (!firedDone) {
      firedDone = true;
      done();
    }
  };

  compiler.watch({
    aggregateTimeout: 300,
  }, cb);
};

const nodemonOpts = { execMap: { js: 'node' }, ignore: ['*'], watch: ['foo/'], ext: 'noop' };
const startServer = () => {
  const script = path.join(samBellRoot, SERVER_OUTPUT_DIR, SERVER_FILENAME);
  nodemon({ ...nodemonOpts, script }).on('restart', () => {
    console.log(chalk.magenta('Restart server...'));
  });
};

gulp.task(TASK_CLIENT, done => webpackWatch(webpackClientConfig, TASK_CLIENT, done));
gulp.task(TASK_SERVER, done => webpackWatch(webpackServerConfig, TASK_SERVER, done));
gulp.task(TASK_DEFAULT, [TASK_CLIENT, TASK_SERVER], startServer);
