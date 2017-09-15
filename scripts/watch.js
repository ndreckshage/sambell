const webpack = require('webpack');
const webpackClientDevConfig = require('./../webpack/webpack.config.client.dev');
const webpackServerDevConfig = require('./../webpack/webpack.config.server.dev');
const handleWebpackStats = require('./../webpack/handle-stats');
const replaceEntry = require('./../webpack/replace-entry');
const chalk = require('chalk');
const path = require('path');

var clientEntriesByChunk = '';
const finalize = (
  serverEntriesByChunk = null,
  _clientEntriesByChunk = null,
) => {
  if (_clientEntriesByChunk) clientEntriesByChunk = _clientEntriesByChunk;
  if (!serverEntriesByChunk || !clientEntriesByChunk) return;

  const serverEntry = serverEntriesByChunk.run[0];
  const serverPath = path.resolve(
    webpackServerDevConfig.output.path,
    serverEntry,
  );

  replaceEntry(
    webpackServerDevConfig,
    webpackClientDevConfig,
    serverEntriesByChunk,
    clientEntriesByChunk,
    () => {
      console.log(
        chalk.green(
          `Development version compiled. Run... ${chalk.bold(
            `node ${path.relative(process.cwd(), serverPath)}`,
          )}`,
        ),
      );
      console.log('');
    },
  );
};

webpack([webpackClientDevConfig, webpackServerDevConfig]).watch(
  {},
  handleWebpackStats(finalize, webpackClientDevConfig),
);
