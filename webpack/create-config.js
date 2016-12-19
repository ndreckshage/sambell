const webpack = require('webpack');
const path = require('path');

const baseOutput = () => {
  if (process.env.SAMBELL_SCRIPT === 'run') return path.resolve(__dirname, '..', 'build');
  return path.resolve(process.cwd(), 'build');
};

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
    context: path.resolve(process.cwd(), 'src'),
    entry: {
      run: [
        require.resolve('babel-polyfill'),
        require.resolve('isomorphic-fetch'),
        scope,
      ],
    },

    output: {
      path: path.resolve(baseOutput(), scope),
      publicPath: '/assets/',
      filename: `${IS_WEB && IS_PROD ? '[hash].' : ''}[name].js`,
      chunkFilename: `${IS_WEB && IS_PROD ? '[chunkhash].' : ''}[id].[name].js`,
    },

    resolve: {
      modules: [
        path.resolve(process.cwd(), 'node_modules'),
        path.resolve(process.cwd(), 'src'),
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
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: require.resolve('image-webpack-loader'),
              query: {
                bypassOnDebug: true,
                optimizationLevel: 7,
                interlaced: false,
              },
            },
            {
              loader: require.resolve('file-loader'),
              query: {
                hash: 'sha512',
                digest: 'hex',
                name: '[hash].[ext]',
              },
            },
          ],
        },
      ],
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

    externals: IS_NODE ? require('./node-externals')() : [],
    performance: { hints: false },
    devtool: 'source-map',
  };

  let overrides = c => c;
  try {
    overrides = require(path.resolve(process.cwd(), 'webpack.overrides'));
  } catch (e) {}

  return overrides(config);
};
