#! /usr/bin/env node

import { RUN, NEW, ADD, WRAP } from './constants';
import runNew from './commands/new';
import runRun from './commands/run';
import runAdd from './commands/add';
import runWrap from './commands/wrap';
import runDefault from './commands';

import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const { _: [command] } = argv;

switch (command) {
  case NEW: runNew(argv); break;
  case RUN: runRun(argv); break;
  case ADD: runAdd(argv); break;
  case WRAP: runWrap(argv); break;
  default: runDefault(argv);
}
