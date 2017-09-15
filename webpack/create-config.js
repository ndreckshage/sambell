const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TimerPlugin = require('./timer-plugin');
const path = require('path');
const readyBanner = require('./ready-banner');

const gerty = require(path.resolve(process.cwd(), 'gerty'));
const CLIENT_ENTRY = gerty.clientEntry;
const SERVER_ENTRY = gerty.serverEntry;
const CLIENT_OUTPUT_DIR = gerty.clientOutputDirectory;
const SERVER_OUTPUT_DIR = gerty.serverOutputDirectory;
const PUBLIC_PATH = gerty.publicPath;

module.exports = (target = 'web', env = 'dev') => {
  const IS_NODE = target === 'node';
  const IS_WEB = target === 'web';

  const IS_PROD = env === 'prod';
  const IS_DEV = env === 'dev';
  process.env.NODE_ENV = IS_PROD ? 'production' : 'development';

  const entryModule = IS_NODE ? SERVER_ENTRY : CLIENT_ENTRY;
  const outputDir = IS_NODE ? SERVER_OUTPUT_DIR : CLIENT_OUTPUT_DIR;

  const entry = {
    run: [
      IS_NODE ? require.resolve('source-map-support/register') : null,
      IS_NODE ? require.resolve('isomorphic-fetch/fetch-npm-node') : null,
      entryModule,
    ].filter(Boolean),
  };

  if (IS_WEB) {
    entry.vendor = [
      require.resolve('babel-polyfill'),
      require.resolve('isomorphic-fetch/fetch-npm-browserify'),
      'react',
      'react-dom',
    ];
  }

  let config = {
    context: process.cwd(),
    target,
    entry,

    output: {
      path: path.resolve(process.cwd(), outputDir),
      publicPath: PUBLIC_PATH,
      filename: `${IS_WEB && IS_PROD ? '[hash].' : ''}[name].js`,
      chunkFilename: `${IS_WEB && IS_PROD ? '[chunkhash].' : ''}[id].[name].js`,
    },

    resolve: {
      modules: [process.cwd(), path.resolve(process.cwd(), 'node_modules')],
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
                require.resolve('babel-plugin-import-inspector'),
                {
                  webpackRequireWeakId: true,
                },
              ],
              [
                require.resolve('babel-plugin-module-resolver'),
                {
                  alias: {
                    'sambell/server': path.resolve(
                      __dirname,
                      '..',
                      'modules',
                      'server',
                    ),
                    'sambell/client': path.resolve(
                      __dirname,
                      '..',
                      'modules',
                      'client',
                    ),
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
      IS_WEB && IS_PROD
        ? new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              comparisons: false,
            },
            output: {
              comments: false,
            },
            sourceMap: true,
          })
        : null,

      IS_WEB && IS_PROD
        ? new webpack.SourceMapDevToolPlugin({
            filename: '[hash].[name].js.map',
            exclude: /manifest\.js/,
          })
        : null,
    ].filter(Boolean),

    devtool: IS_DEV
      ? 'cheap-module-source-map'
      : IS_NODE ? 'cheap-source-map' : false,

    performance: { hints: false },
  };

  if (IS_NODE) {
    config.externals = [
      nodeExternals({
        whitelist: [
          '@humblespark/react-loadable',
          'is-webpack-bundle',
          'import-inspector',
          'webpack-require-weak',
        ],
      }),
    ];
    config.node = { console: true, __filename: true, __dirname: true };
  } else {
    config.node = { fs: 'empty', net: 'empty', tls: 'empty' };
  }

  if (gerty.webpack) {
    config = gerty.webpack(config, {
      webpack,
      env: {
        IS_NODE,
        IS_DEV,
      },
    });
  }

  config.plugins = [
    ...config.plugins,
    IS_WEB ? new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }) : null,
    IS_WEB
      ? new webpack.optimize.CommonsChunkPlugin({ name: 'manifest' })
      : null,
    IS_WEB
      ? new webpack.BannerPlugin({
          banner: readyBanner,
          raw: true,
          exclude: /manifest\.js/,
        })
      : null,
    IS_WEB
      ? new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          },
        })
      : null,
    new TimerPlugin(),
  ].filter(Boolean);

  return config;
};
