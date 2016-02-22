import ExtractTextPlugin from 'extract-text-webpack-plugin';

const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    presets: [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0'),
    ],
    plugins: [],
  },
};

const jsonLoader = {
  test: /\.json$/,
  loader: 'json-loader',
};

const cssLoader = {
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&localIdentName=[local]--[hash:base64:5]!autoprefixer-loader!sass-loader'),
};

const imagesLoader = {
  test: /\.(jpe?g|png|gif|svg)$/i,
  loaders: [
    'file?hash=sha512&digest=hex&name=images/[hash].[ext]',
    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
  ],
};

const fontsLoader = {
  test: /\.(ttf|eot|woff)?$/,
  loader: 'file-loader?name=fonts/[hash].[ext]',
};

export default {
  jsLoader,
  jsonLoader,
  cssLoader,
  imagesLoader,
  fontsLoader,
};
