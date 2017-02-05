const webpack = require('webpack');
const webpackClientDevConfig = require('./../webpack/webpack.config.client.dev');
const webpackServerDevConfig = require('./../webpack/webpack.config.server.dev');
const handleWebpackStats = require('./../webpack/handle-stats');
const spawn = require('child_process').spawn;
const path = require('path');

var server = null;
const refreshServer = ([clientEntry, serverEntry]) => {
  if (server) server.kill();
  const serverPath = path.resolve(webpackServerDevConfig.output.path, serverEntry);
  server = spawn('node', [serverPath], { stdio: 'inherit', env: process.env });
};

webpack([
  webpackClientDevConfig,
  webpackServerDevConfig,
]).watch({}, handleWebpackStats(refreshServer));
