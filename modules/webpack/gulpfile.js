/* eslint-disable no-console, handle-callback-err */

import gulp from 'gulp';
import webpack from 'webpack';
import nodemon from 'nodemon';
import path from 'path';
import chalk from 'chalk';
import gutil from 'gutil';

import clientConfig from './config.client';
// import serverConfig from './config.server';

gulp.task('webpack-client', (done) => {
  // let firedDone = false;
  // webpack(clientConfig).watch(100, () => {
  //   if (!firedDone) {
  //     firedDone = true;
  //     done();
  //   }
  //
  //   console.log(chalk.cyan('Client build complete.'));
  // });

  webpack(clientConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString());
    done();
  });
});

gulp.task('webpack-server', (done) => {
  console.log('server');
  // let firedDone = false;
  // webpack(serverConfig).watch(100, (err, stats) => {
  //   if (!firedDone) {
  //     firedDone = true;
  //     done();
  //   }
  //
  //   console.log(chalk.cyan('Server build complete.'));
  //   nodemon.restart();
  // });
});

gulp.task('default', ['webpack-server', 'webpack-client'], () => {
  nodemon({
    execMap: {
      js: 'node',
    },
    script: path.join(__dirname, 'dist/webpack/server'),
    ignore: ['*'],
    watch: ['foo/'],
    ext: 'noop',
  }).on('restart', () => {
    console.log(chalk.magenta('Restart server...'));
  });
});
