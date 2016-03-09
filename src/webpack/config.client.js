import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { loaders, devtool } from './shared';
import {
  CLIENT_ENTRY, CLIENT_OUTPUT_DIR, CLIENT_PUBLIC_MOUNT, APP_DIR,
  CLIENT_FILENAME, CSS_FILENAME, MINIFIED, CSS_EXT, JS_EXT,
} from './constants';

const entry = path.join(__dirname, '..', '..', APP_DIR, CLIENT_ENTRY);

export default (outputBase) => {
  const outputPath = path.join(outputBase, CLIENT_OUTPUT_DIR);
  const __PROD__ = process.env.NODE_ENV === 'production';

  let prod = [];
  if (__PROD__) {
    prod = [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
    ];
  }

  return {
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
      new ExtractTextPlugin(`${CSS_FILENAME}${__PROD__ ? MINIFIED : ''}${CSS_EXT}`),
      ...prod,
    ],
    output: {
      path: outputPath,
      publicPath: CLIENT_PUBLIC_MOUNT,
      filename: `${CLIENT_FILENAME}${__PROD__ ? MINIFIED : ''}${JS_EXT}`,
    },
  };
};
