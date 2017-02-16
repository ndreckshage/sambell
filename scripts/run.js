const webpack = require('webpack');
const webpackClientDevConfig = require('./../webpack/webpack.config.client.dev');
const webpackServerDevConfig = require('./../webpack/webpack.config.server.dev');
const handleWebpackStats = require('./../webpack/handle-stats');
const replaceEntry = require('./../webpack/replace-entry');
const spawn = require('child_process').spawn;
const chalk = require('chalk');
const path = require('path');

var server = null;
var _clientEntry = '';
const refreshServer = (clientEntry = null, serverEntry = null) => {
  if (clientEntry) _clientEntry = clientEntry;
  if (!serverEntry || !_clientEntry) return;

  const serverPath = path.resolve(webpackServerDevConfig.output.path, serverEntry);
  replaceEntry(serverPath, _clientEntry, () => {
    if (server) server.kill();
    console.log(chalk.cyan(`${server ? 'Restarting' : 'Starting'} sambell...`));
    server = spawn('node', [serverPath], { stdio: 'inherit', env: process.env });
  });
};

webpack([
  webpackClientDevConfig,
  webpackServerDevConfig,
]).watch({}, handleWebpackStats(refreshServer));
