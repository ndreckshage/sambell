const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (target = 'web', env = 'dev') => {
  const IS_NODE = target === 'node';
  const IS_WEB = target === 'web';
  const IS_PROD = env === 'prod';
  const IS_DEV = env === 'dev';

  // Set node env here based on webpack config. Mostly for client build
  process.env.NODE_ENV = IS_PROD ? 'production' : 'development';

  // Put client and server code in separate directories.
  const scope = IS_NODE ? 'server' : 'client';

  const config = {
    target: target,
    context: process.cwd(),
    entry: {
      run: [
        require.resolve('babel-polyfill'),
        require.resolve('isomorphic-fetch'),
        scope,
      ],
    },

    output: {
      path: path.resolve(process.cwd(), '.sambell', scope),
      publicPath: '/sambell/',
      filename: `${IS_WEB && IS_PROD ? '[hash].' : ''}[name].js`,
      chunkFilename: `${IS_WEB && IS_PROD ? '[chunkhash].' : ''}[id].[name].js`,
    },

    resolve: {
      modules: [
        'node_modules',
        process.cwd(),
      ],
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            presets: [
              require.resolve('babel-preset-es2015'),
              require.resolve('babel-preset-stage-1'),
              require.resolve('babel-preset-react'),
            ],
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: require.resolve('@humblespark/style-loader'),
              query: {
                fullLocalExport: true,
              },
            },
            {
              loader: require.resolve('css-loader'),
              query: {
                modules: true,
                sourceMap: false,
                localIdentName: `${IS_DEV ? '[name]__[local]___' : ''}[hash:base64:5]`,
              },
            },
          ]
        },
      ],

      exprContextRegExp: /$^/,
      exprContextCritical: false,
    },

    plugins: [
      IS_WEB ? new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        },
      }) : null,
      IS_PROD ? new webpack.optimize.UglifyJsPlugin({ compress: { warnings: true }}) : null,
      IS_PROD ? new webpack.optimize.AggressiveMergingPlugin() : null,
    ].filter(a => a),

    performance: { hints: false },
    devtool: IS_NODE || IS_DEV ? 'eval-source-map' : 'source-map',
  };

  if (IS_NODE) {
    config.externals = [nodeExternals()];
    config.node = { console: true, __filename: true, __dirname: true };
  }

  let overrides = c => c;
  try {
    overrides = require(path.resolve(process.cwd(), 'webpack.overrides'));
  } catch (e) {}

  return overrides(config);
};
