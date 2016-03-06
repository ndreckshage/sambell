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

import autoprefixer from 'autoprefixer';
import precss from 'precss';

import { setConstants } from './shared';
import { SERVER_OUTPUT_DIR, SERVER_FILENAME, APP_DIR, JS_EXT, MINIFIED } from './constants';

const CLIENT = 'client';
const SERVER = 'server';

const TASK_DEFAULT = 'default';
const TASK_BUILD = 'build';
const TASK_CLIENT_RUN = 'webpack-client-run';
const TASK_SERVER_RUN = 'webpack-server-run';
const TASK_CLIENT_BUILD = 'webpack-client-build';
const TASK_SERVER_BUILD = 'webpack-server-build';

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
  fs.accessSync(path.join(cwd, `${gerty}${gerty.endsWith(JS_EXT) ? '' : JS_EXT}`), fs.R_OK);
  gertyPath = gerty;
} catch (e) {} // eslint-disable-line

let cliAppOptions = {
  __GERTY_ENV__: JSON.stringify(env),
  __GERTY_ENTRY__: JSON.stringify(entry),
  __GERTY_PATH__: JSON.stringify(gertyPath),
};

const compiler = (config, task) => {
  cliAppOptions = {
    ...cliAppOptions,
    __CLIENT__: JSON.stringify(task === TASK_CLIENT_RUN),
    __SERVER__: JSON.stringify(task === TASK_SERVER_RUN),
  };

  return webpack({
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
    postcss: () => [
      autoprefixer,
      precss,
    ],
  });
};

const webpackStats = (err, stats, taskEnv) => {
  if (err) throw new gutil.PluginError('webpack', err);
  const jsonStats = stats.toJson();
  if (jsonStats.errors.length > 0) gutil.log(chalk.red(jsonStats.errors));
  if (jsonStats.warnings.length > 0) gutil.log(chalk.yellow(jsonStats.warnings));
  if (jsonStats.errors.length === 0 && jsonStats.warnings.length === 0) gutil.log(chalk.green(`[${taskEnv}]`), stats.toString());
};

const webpackBuild = (config, taskEnv, done) => {
  compiler(config, taskEnv).run((err, stats) => {
    webpackStats(err, stats, taskEnv);
    done();
  });
};

const webpackWatch = (config, taskEnv, done) => {
  let firedDone = false;
  compiler(config, taskEnv).watch({
    aggregateTimeout: 300,
  }, (err, stats) => {
    webpackStats(err, stats, taskEnv);
    if (taskEnv === SERVER) nodemon.restart();
    if (!firedDone) {
      firedDone = true;
      done();
    }
  });
};

const __PROD__ = process.env.NODE_ENV === 'production';
const nodemonOpts = { execMap: { js: 'node' }, ignore: ['*'], watch: ['foo/'], ext: 'noop' };
const startDevServer = () => {
  const script = `${cwd}/${SERVER_OUTPUT_DIR}/${SERVER_FILENAME}${__PROD__ ? MINIFIED : ''}${JS_EXT}`;
  nodemon({ ...nodemonOpts, script }).on('restart', () => {
    console.log(chalk.magenta('Restart server...'));
  });
};

gulp.task(TASK_CLIENT_RUN, done => webpackWatch(webpackClientConfig(), CLIENT, done));
gulp.task(TASK_SERVER_RUN, done => webpackWatch(webpackServerConfig(), SERVER, done));
gulp.task(TASK_DEFAULT, [TASK_CLIENT_RUN, TASK_SERVER_RUN], startDevServer);

gulp.task(TASK_CLIENT_BUILD, done => webpackBuild(webpackClientConfig(), CLIENT, done));
gulp.task(TASK_SERVER_BUILD, done => webpackBuild(webpackServerConfig(), SERVER, done));
gulp.task(TASK_BUILD, [TASK_CLIENT_BUILD, TASK_SERVER_BUILD]);
