/* eslint-disable no-console */

import { ncp } from 'ncp';
import path from 'path';
import chalk from 'chalk';

const cwd = process.cwd();

export default argv => {
  const { _: commands } = argv;
  const [, target] = commands;
  const blueprint = path.join(__dirname, '..', '..', '..', 'modules', 'blueprint');
  const destination = path.join(cwd, target);

  ncp(blueprint, destination, (err) => {
    if (err) {
      console.log(chalk.red(err));
    } else {
      console.log(chalk.green(`sambell DNA successfully copied to ${target}`));
      console.log(chalk.cyan(`cd ${target} && npm install && npm start`));
    }
  });
};
