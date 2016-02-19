import webpack from 'webpack';
import path from 'path';
import findExternals from './findExternals';
import { loaders, devtool } from './shared';
import {
  SERVER_ENTRY, SERVER_OUTPUT_DIR, APP_DIR,
  SERVER_FILENAME as filename,
} from './constants';

// import ExtractTextPlugin from 'extract-text-webpack-plugin';
const bannerPlugin = new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false });

const externals = findExternals();
const entry = path.join(__dirname, '..', '..', APP_DIR, SERVER_ENTRY);
const outputPath = path.join(__dirname, '..', '..', SERVER_OUTPUT_DIR);

module.exports = {
  entry,
  devtool,
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
  externals,
  plugins: [
    // new ExtractTextPlugin(PRODUCTION_BUILD ? 'styles/main-min.css' : 'styles/main.css'),
    bannerPlugin,
  ],
  output: {
    path: outputPath,
    // filename: PRODUCTION_BUILD ? 'server-min.js' : 'server.js',
    filename,
  },
};
