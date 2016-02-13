import webpack from 'webpack';
import fs from 'fs';
import path from 'path';
import { constants, resolve, loaders, devtool } from './shared';
import {
  SERVER_ENTRY, SERVER_OUTPUT_DIR, APP_BASE,
  SERVER_FILENAME as filename,
} from './constants';

// import ExtractTextPlugin from 'extract-text-webpack-plugin';
const bannerPlugin = new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false });

const nodeModules = {};
const backendConfigFilter = x => ['.bin'].indexOf(x) === -1;
const backendConfigEach = mod => nodeModules[mod] = `commonjs ${mod}`;
fs.readdirSync(path.join(__dirname, '..', '..', 'node_modules'))
  .filter(backendConfigFilter)
  .forEach(backendConfigEach);

const entry = path.join(__dirname, '..', APP_BASE, SERVER_ENTRY);
const outputPath = path.join(__dirname, '..', SERVER_OUTPUT_DIR);

module.exports = {
  entry,
  resolve,
  module: {
    loaders: [
      loaders.jsLoader,
      loaders.jsonLoader,
      loaders.cssLoader,
      loaders.imagesLoader,
      loaders.fontsLoader,
    ],
  },
  target: 'node',
  node: { __dirname: true, __filename: true },
  externals: nodeModules,
  plugins: [
    // new ExtractTextPlugin(PRODUCTION_BUILD ? 'styles/main-min.css' : 'styles/main.css'),
    new webpack.DefinePlugin(constants),
    bannerPlugin,
  ],
  output: {
    path: outputPath,
    // filename: PRODUCTION_BUILD ? 'server-min.js' : 'server.js',
    filename,
  },
  devtool,
};
