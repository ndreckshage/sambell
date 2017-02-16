const webpack = require('webpack');
const webpackClientProdConfig = require('./../webpack/webpack.config.client.prod');
const webpackServerProdConfig = require('./../webpack/webpack.config.server.prod');
const handleWebpackStats = require('./../webpack/handle-stats');
const replaceEntry = require('./../webpack/replace-entry');
const chalk = require('chalk');
const path = require('path');

const finalize = (clientEntry = null, serverEntry = null) => {
  if (!clientEntry || !serverEntry) {
    console.log(chalk.red('No client/server entry.'), clientEntry, serverEntry);
    return;
  }

  const serverPath = path.resolve(webpackServerProdConfig.output.path, serverEntry);
  replaceEntry(serverPath, clientEntry, () => {
    console.log(chalk.green('Production version built. Run...'));
    console.log(chalk.cyan(`node ${serverPath}`));
  });
};

console.log(chalk.green('Building...'));
webpack([
  webpackClientProdConfig,
  webpackServerProdConfig,
]).run(handleWebpackStats(finalize));
