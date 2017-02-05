const webpack = require('webpack');
const webpackClientProdConfig = require('./../webpack/webpack.config.client.prod');
const webpackServerProdConfig = require('./../webpack/webpack.config.server.prod');
const handleWebpackStats = require('./../webpack/handle-stats');
const chalk = require('chalk');

const finalize = ([clientEntry, serverEntry]) => {
  console.log(chalk.green('Production version built. Run...'));
  console.log(chalk.cyan(`SAMBELL_CLIENT_ENTRY=${clientEntry} node .sambell/server/${serverEntry}`));
};

console.log(chalk.green('Building...'));
webpack([
  webpackClientProdConfig,
  webpackServerProdConfig,
]).run(handleWebpackStats(finalize));
