const webpack = require('webpack');
const fileSystem = require('fs');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bannerPlugin = new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false });

const shared = require('./shared');
const PRODUCTION_BUILD = shared.loadEnv();
const constants = shared.constants;
const resolve = shared.resolve;
const loaders = shared.loaders;
const devtool = shared.devtool;

const nodeModules = {};
const backendConfigFilter = x => ['.bin'].indexOf(x) === -1;
const backendConfigEach = mod => nodeModules[mod] = `commonjs ${mod}`;
fileSystem
  .readdirSync('node_modules')
  .filter(backendConfigFilter)
  .forEach(backendConfigEach);

// expose additional config to server
constants.__CLIENT__ = false;
constants.__SERVER__ = true;

module.exports = {
  entry: './src/server',
  resolve,
  module: {
    loaders: [
      loaders.jsLoader,
      loaders.cssLoader,
      loaders.imagesLoader,
      loaders.fontsLoader,
    ],
  },
  target: 'node',
  node: {
    __dirname: true,
    __filename: true,
  },
  externals: nodeModules,
  plugins: [
    new ExtractTextPlugin(PRODUCTION_BUILD ? 'styles/main-min.css' : 'styles/main.css'),
    new webpack.DefinePlugin(constants),
    bannerPlugin,
  ],
  output: {
    path: path.join(__dirname, '..', 'dist', 'webpack'),
    publicPath: '/public/',
    filename: PRODUCTION_BUILD ? 'server-min.js' : 'server.js',
  },
  devtool,
};
