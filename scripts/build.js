const webpack = require('webpack');
const webpackClientProdConfig = require('./../webpack/webpack.config.client.prod');
const webpackServerProdConfig = require('./../webpack/webpack.config.server.prod');
const handleWebpackStats = require('./../webpack/handle-stats');
const chalk = require('chalk');
const path = require('path');

const finalize = ([clientEntry, serverEntry]) => {
  const SAMBELL_CLIENT_OUTPUT_DIR = webpackClientProdConfig.output.path;
  const SAMBELL_CLIENT_ENTRY = path.resolve(webpackClientProdConfig.output.publicPath, clientEntry);
  const serverPath = path.resolve(webpackServerProdConfig.output.path, serverEntry);

  console.log(chalk.green('Production version built. Run...'));
  console.log(chalk.cyan(`SAMBELL_CLIENT_OUTPUT_DIR=${SAMBELL_CLIENT_OUTPUT_DIR} SAMBELL_CLIENT_ENTRY=${SAMBELL_CLIENT_ENTRY} node ${serverPath}`));
};

console.log(chalk.green('Building...'));
webpack([
  webpackClientProdConfig,
  webpackServerProdConfig,
]).run(handleWebpackStats(finalize));
