import {
  universal as universalDefaults,
  client as clientDefaults,
  server as serverDefaults,
  env as envDefaults,
} from './gerty.defaults';

let universalOptions = {};
let clientOptions = {};
let serverOptions = {};
let envOptions = {};

if (__GERTY_PATH__) {
  const gertyOptions = require(__GERTY_PATH__);
  universalOptions = gertyOptions.universal;
  clientOptions = gertyOptions.client;
  serverOptions = gertyOptions.server;
  envOptions = gertyOptions.env;
} else {
  if (__DEV__) {
    console.warn('No gerty.js your application. Add gerty (sambell add --gerty) to customize your app!'); // eslint-disable-line
  }
} // eslint-disable-line

export const universal = { ...universalDefaults, ...universalOptions };
export const client = { ...clientDefaults, ...clientOptions };
export const server = { ...serverDefaults, ...serverOptions };

const envs = { ...envDefaults, ...envOptions };
export const env = envs[__GERTY_ENV__];
