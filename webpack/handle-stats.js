const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const filesize = require('filesize');
const gzipSize = require('gzip-size').sync;
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

// Not ideal but ok for now. Client & server errors often the same.
var LIKELY_SAME_ERR = 200;
var prevErrorTimestamp = null;
var prevWarnTimestamp = null;

module.exports = (cb, clientConfig) => (err, multiStats) => {
  console.log('');
  if (err) {
    console.error(err.stack || err);
    if (err.details) console.error(err.details);
    return;
  }

  let clientEntry = null;
  let serverEntry = null;
  let hasError = false;
  multiStats.stats.forEach((stats) => {
    const json = stats.toJson({}, true);
    const messages = formatWebpackMessages(json);

    if (messages.errors.length) {
      const skipErr = prevErrorTimestamp && Date.now() - prevErrorTimestamp < LIKELY_SAME_ERR;
      prevErrorTimestamp = Date.now();
      hasError = true;

      if (!skipErr) {
        console.log(chalk.bold.red('Failed to compile.\n'));
        messages.errors.forEach(e => console.log(e));
      }

      return;
    }

    if (messages.warnings.length) {
      const skipErr = prevWarnTimestamp && Date.now() - prevWarnTimestamp < LIKELY_SAME_ERR;
      prevWarnTimestamp = Date.now();

      if (!skipErr) {
        console.log(chalk.bold.yellow('Compiled with warnings.\n'));
        messages.warnings.forEach(w => console.log(w));
      }
    }

    if (!messages.errors.length && !messages.warnings.length) {
      const IS_WEB = stats.compilation.compiler.options.target === 'web';
      const chalkColor = IS_WEB ? 'blue' : 'magenta';
      console.log(chalk[chalkColor](`${chalk.bold(IS_WEB ? 'CLIENT' : 'SERVER')} (${json.time}ms)`));

      json.assets.map(asset => {
        const assetPath = path.join(clientConfig.output.path, asset.name);

        let size = '';
        if (IS_WEB && process.env.NODE_ENV === 'production') {
          const fileContents = fs.readFileSync(assetPath);
          size = ` (SIZE AFTER GZIP: ${chalk.bold(filesize(gzipSize(fileContents)))})`;
        }

        console.log(chalk[chalkColor](`${asset.name}${size}`));
      });

      console.log('');
      const entry = typeof json.assetsByChunkName.run === 'object' ? json.assetsByChunkName.run[0] : json.assetsByChunkName.run;
      if (IS_WEB) {
        clientEntry = entry;
      } else {
        serverEntry = entry;
      }
    }
  });

  if (!hasError) cb(clientEntry, serverEntry);
};
