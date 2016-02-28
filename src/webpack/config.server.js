import webpack from 'webpack';
import path from 'path';
import findExternals from './findExternals';
import { loaders, devtool } from './shared';
import {
  SERVER_ENTRY, SERVER_OUTPUT_DIR, APP_DIR,
  SERVER_FILENAME, CSS_FILENAME, MINIFIED, CSS_EXT, JS_EXT,
} from './constants';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
const bannerPlugin = new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false });

const externals = findExternals();
const entry = path.join(__dirname, '..', '..', APP_DIR, SERVER_ENTRY);
const outputPath = path.join(process.cwd(), SERVER_OUTPUT_DIR);

export default () => {
  const __PROD__ = process.env.NODE_ENV === 'production';

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
    target: 'node',
    node: { __dirname: true, __filename: true },
    externals,
    plugins: [
      new ExtractTextPlugin(`${CSS_FILENAME}${__PROD__ ? MINIFIED : ''}${CSS_EXT}`),
      bannerPlugin,
    ],
    output: {
      path: outputPath,
      filename: `${SERVER_FILENAME}${__PROD__ ? MINIFIED : ''}${JS_EXT}`,
    },
  };
};
