const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const BUILD_PREFIX = '.sambell';
const getBuildDir = scope => path.join(BUILD_PREFIX, scope);

module.exports = (target = 'web', env = 'dev') => {
  const IS_NODE = target === 'node';
  const IS_WEB = target === 'web';
  const IS_PROD = env === 'prod';
  const IS_DEV = env === 'dev';
  const SERVER_ENTRY = 'server';
  const CLIENT_ENTRY = 'client';
  const scope = IS_NODE ? SERVER_ENTRY : CLIENT_ENTRY;

  process.env.NODE_ENV = IS_PROD ? 'production' : 'development';

  const buildDir = getBuildDir(scope);

  let config = {
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
      path: path.resolve(process.cwd(), buildDir),
      publicPath: '/static/webpack/',
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
              require.resolve('styled-jsx/babel'),
              [
                require.resolve('babel-plugin-module-resolver'),
                {
                  alias: {
                    'sambell/env': path.resolve(__dirname, 'sambell-env'),
                  },
                },
              ],
            ],
          },
        },
      ],

      exprContextCritical: false,
    },

    plugins: [
      IS_WEB ? new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
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

  let gerty = {};
  try { gerty = require(path.resolve(process.cwd(), 'gerty')); } catch (e) {}
  if (gerty.webpack) config = gerty.webpack(config, { node: IS_NODE, dev: IS_DEV }, webpack);

  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      SAMBELL_CLIENT_OUTPUT_DIR: JSON.stringify(getBuildDir(CLIENT_ENTRY)),
      SAMBELL_PUBLIC_PATH: JSON.stringify(config.output.publicPath),
    }),
  ];

  return config;
};
