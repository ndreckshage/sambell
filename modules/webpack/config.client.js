import webpack from 'webpack';
import path from 'path';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { constants, resolve, loaders, devtool } from './shared';

const entry = path.join(__dirname, '..', 'app', 'createClient.js');
const outputPath = path.join(__dirname, '..', 'public');
console.log(entry, outputPath)

export default {
  entry,
  resolve,
  module: {
    loaders: [
      loaders.jsLoader,
      loaders.cssLoader,
      loaders.imagesLoader,
      loaders.fontsLoader,
    ],
  },
  plugins: [
    new webpack.DefinePlugin(constants),
    // new ExtractTextPlugin(PRODUCTION_BUILD ? 'styles/main-min.css' : 'styles/main.css'),
    // new ExtractTextPlugin('styles/main.css'),
  ],
  output: {
    path: outputPath,
    publicPath: '/public/',
    // filename: PRODUCTION_BUILD ? 'scripts/main-min.js' : 'scripts/main.js',
    filename: 'client.js',
  },
  devtool,
};
