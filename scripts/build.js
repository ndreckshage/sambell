const webpack = require('webpack');
const webpackClientProdConfig = require('./../webpack/webpack.config.client.prod');
const webpackServerProdConfig = require('./../webpack/webpack.config.server.prod');
const handleWebpackStats = require('./../webpack/handle-stats');
const replaceEntry = require('./../webpack/replace-entry');
const chalk = require('chalk');
const path = require('path');

var clientEntriesByChunk = '';
const finalize = (serverEntriesByChunk = null, _clientEntriesByChunk = null) => {
  if (_clientEntriesByChunk) clientEntriesByChunk = _clientEntriesByChunk;
  if (!serverEntriesByChunk || !clientEntriesByChunk) {
    console.log(chalk.red('No client/server entry.'), clientEntry, serverEntry);
    return;
  }

  const serverEntry = serverEntriesByChunk.run[0];
  const serverPath = path.resolve(webpackServerProdConfig.output.path, serverEntry);

  replaceEntry(
    webpackServerProdConfig,
    webpackClientProdConfig,
    serverEntriesByChunk,
    clientEntriesByChunk,
    () => {
      console.log(chalk.green(`Production version built. Run... ${chalk.bold(`node ${path.relative(process.cwd(), serverPath)}`)}`));
      console.log('');
    }
  );
};

webpack([
  webpackClientProdConfig,
  webpackServerProdConfig,
]).run(
  handleWebpackStats(
    finalize,
    webpackClientProdConfig
  )
);
