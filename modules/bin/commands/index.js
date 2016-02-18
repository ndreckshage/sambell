import packageJson from './../../../package.json';
import chalk from 'chalk';

export default argv => {
  const { version, v } = argv;
  if (v || version) {
    console.log(chalk.cyan(packageJson.version)); // eslint-disable-line
  }
};
