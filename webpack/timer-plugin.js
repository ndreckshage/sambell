const chalk = require('chalk');
const clearConsole = require('react-dev-utils/clearConsole');

// Not ideal but ok for now. Client & server compilation...
var LIKELY_SAME_COMPILE = 200;
var prevCompileStartTime = null;

function TimerPlugin() {}

TimerPlugin.prototype.apply = function(compiler) {
  compiler.plugin("compile", function(params) {
    const skipMessage = prevCompileStartTime && Date.now() - prevCompileStartTime < LIKELY_SAME_COMPILE;
    prevCompileStartTime = Date.now();

    if (!skipMessage) {
      clearConsole();
      console.log(chalk.red.bgYellow("Wake Me When It's Quitting Time."));
      console.log('');
      console.log(chalk.green('Compiling...'));
    }
  });
}

module.exports = TimerPlugin;
