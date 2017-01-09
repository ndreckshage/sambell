process.env.SAMBELL_SCRIPT = 'run';

const webpack = require('webpack');
const webpackClientDevConfig = require('./../webpack/webpack.config.client.dev');
const webpackServerDevConfig = require('./../webpack/webpack.config.server.dev');
const handleWebpackStats = require('./../webpack/handle-stats');
const spawn = require('child_process').spawn;
const path = require('path');
const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');

var server = null;
const refreshServer = ([clientEntry, serverEntry]) => {
  if (server) server.kill();

  process.env.NODE_PATH = nodeModulesPath;
  process.env.SAMBELL_CLIENT_OUTPUT_DIR = webpackClientDevConfig.output.path;
  process.env.SAMBELL_CLIENT_ENTRY = path.resolve(webpackClientDevConfig.output.publicPath, clientEntry);
  process.env.SAMBELL_SERVER_PORT = process.env.SAMBELL_SERVER_PORT || '3000';

  const serverPath = path.resolve(webpackServerDevConfig.output.path, serverEntry);
  server = spawn('node', [serverPath], { stdio: 'inherit', env: process.env });
};

webpack([
  webpackClientDevConfig,
  webpackServerDevConfig,
]).watch({}, handleWebpackStats(refreshServer));
