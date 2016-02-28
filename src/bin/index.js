#! /usr/bin/env node

import { RUN, BUILD, NEW, ADD, WRAP } from './constants';
import runNew from './commands/new';
import runAdd from './commands/add';
import runGulp from './commands/gulp';
import runWrap from './commands/wrap';
import runDefault from './commands';

import minimist from 'minimist';
const argv = minimist(process.argv.slice(2));
const { _: [command] } = argv;

switch (command) {
  case NEW: runNew(argv); break;
  case ADD: runAdd(argv); break;
  case WRAP: runWrap(argv); break;
  case RUN: runGulp(argv, 'default'); break;
  case BUILD: runGulp(argv, 'build'); break;
  default: runDefault(argv);
}
