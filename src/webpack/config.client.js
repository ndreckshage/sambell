import path from 'path';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { loaders, devtool } from './shared';
import {
  CLIENT_ENTRY, CLIENT_OUTPUT_DIR, CLIENT_PUBLIC_MOUNT, APP_DIR,
  CLIENT_FILENAME as filename,
} from './constants';

const entry = path.join(__dirname, '..', '..', APP_DIR, CLIENT_ENTRY);
const outputPath = path.join(__dirname, '..', '..', CLIENT_OUTPUT_DIR);

export default {
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
  plugins: [
    // new ExtractTextPlugin(PRODUCTION_BUILD ? 'styles/main-min.css' : 'styles/main.css'),
  ],
  output: {
    path: outputPath,
    publicPath: CLIENT_PUBLIC_MOUNT,
    // filename: PRODUCTION_BUILD ? 'scripts/main-min.js' : 'scripts/main.js',
    filename,
  },
};
