module.exports = () => {
  return require('fs').readdirSync(require('path').join(process.cwd(), 'node_modules'))
    .filter(entry => ['.bin'].indexOf(entry) === -1)
    .reduce((result, entry) => {
      return Object.assign(result, {
        [entry]: `commonjs ${entry}`,
      });
    }, {});
 };
