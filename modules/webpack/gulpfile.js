/* eslint-disable no-console, handle-callback-err */

import gulp from 'gulp';
import webpack from 'webpack';
import nodemon from 'nodemon';
import minimist from 'minimist';
import path from 'path';
import chalk from 'chalk';
import gutil from 'gutil';
import fs from 'fs';
import { setConstants } from './shared';

import webpackClientConfig from './config.client';
import webpackServerConfig from './config.server';

import { SERVER_OUTPUT_DIR, SERVER_FILENAME } from './constants';

const WATCH_MS = 300;
const TASK_DEFAULT = 'default';
const TASK_CLIENT = 'webpack-client';
const TASK_SERVER = 'webpack-server';

const samBellRoot = path.join(__dirname, '..', '..');
const samBellModules = path.join(samBellRoot, 'node_modules');
const samBellApp = path.join(samBellRoot, 'app');

const argv = minimist(process.argv.slice(2));
const { env, cwd } = argv;

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

const webpackWatch = (config, task, done) => {
  // let firedDone = false;
  const compiler = webpack({
    ...config,
    resolve: {
      root: [samBellModules, cwd],
      alias: { sambell: samBellApp },
    },
    resolveLoader: { root: [samBellModules] },
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin(setConstants()),
      new webpack.DefinePlugin({ __GERTY_ENV__: JSON.stringify(env) }),
    ],
  });

  compiler.run((err, stats) => {
    const s = stats.toJson();
    s.errors.forEach(err => {
      console.log(err);
    })

    done();
  });

//   compiler.watch({ // watch options:
//     aggregateTimeout: 300, // wait so long for more changes
//     poll: true // use polling instead of native watchers
//     // pass a number to set the polling interval
// }, function(err, stats) {
//     // ...
// });

  // .watch(WATCH_MS, (err, stats) => {
  //   if (err) throw new gutil.PluginError('webpack', err);
  //   gutil.log(chalk.green(`[${task}]`), stats.toString());
  //   if (!firedDone) {
  //     firedDone = true;
  //     done();
  //   }
  // });

  // if(err)
  //       return handleFatalError(err);
  //   var jsonStats = stats.toJson();
  //   if(jsonStats.errors.length > 0)
  //       return handleSoftErrors(jsonStats.errors);
  //   if(jsonStats.warnings.length > 0)
  //       handleWarnings(jsonStats.warnings);
  //   successfullyCompiled();
};

const nodemonOpts = { execMap: { js: 'node' }, ignore: ['*'], watch: ['foo/'], ext: 'noop' };
const startServer = () => {
  const script = path.join(__dirname, '..', '..', SERVER_OUTPUT_DIR, SERVER_FILENAME);
  nodemon({ ...nodemonOpts, script }).on('restart', () => {
    console.log(chalk.magenta('Restart server...'));
  });
};

gulp.task(TASK_CLIENT, done => webpackWatch(webpackClientConfig, TASK_CLIENT, done));
gulp.task(TASK_SERVER, done => webpackWatch(webpackServerConfig, TASK_SERVER, done));
gulp.task(TASK_DEFAULT, [TASK_CLIENT, TASK_SERVER], startServer);
