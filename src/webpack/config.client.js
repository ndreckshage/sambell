import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { loaders, devtool } from './shared';
import {
  CLIENT_ENTRY, CLIENT_OUTPUT_DIR, CLIENT_PUBLIC_MOUNT, APP_DIR,
  CLIENT_FILENAME, CSS_FILENAME, MINIFIED, CSS_EXT, JS_EXT,
} from './constants';

const entry = path.join(__dirname, '..', '..', APP_DIR, CLIENT_ENTRY);
const outputPath = path.join(process.cwd(), CLIENT_OUTPUT_DIR);

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
    plugins: [
      new ExtractTextPlugin(`${CSS_FILENAME}${__PROD__ ? MINIFIED : ''}${CSS_EXT}`),
    ],
    output: {
      path: outputPath,
      publicPath: CLIENT_PUBLIC_MOUNT,
      filename: `${CLIENT_FILENAME}${__PROD__ ? MINIFIED : ''}${JS_EXT}`,
    },
  };
};
