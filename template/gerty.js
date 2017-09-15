module.exports = {
  clientEntry: 'client',
  serverEntry: 'server',
  clientOutputDirectory: '.sambell/client',
  serverOutputDirectory: '.sambell/server',
  publicPath: '/static/webpack/',
  webpack: config => config,
};
