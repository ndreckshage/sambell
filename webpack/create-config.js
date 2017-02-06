const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = (target = 'web', env = 'dev') => {
  const IS_NODE = target === 'node';
  const IS_WEB = target === 'web';
  const IS_PROD = env === 'prod';
  const IS_DEV = env === 'dev';
  const scope = IS_NODE ? 'server' : 'client';

  process.env.NODE_ENV = IS_PROD ? 'production' : 'development';

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
        process.cwd(),
        path.resolve(process.cwd(), 'node_modules'),
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
            plugins: [
              require.resolve('styled-jsx/babel')
            ],
          },
        },
      ],

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

  try {
    const gerty = require(path.resolve(process.cwd(), 'gerty'));
    if (gerty.webpack) return gerty.webpack(config, { node: IS_NODE, dev: IS_DEV })
  } catch (e) {}

  return config;
};
