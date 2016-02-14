import defaults from './gerty';

let options = {};
if (__GERTY_EXISTS__) {
  options = require(__GERTY_PATH__).default;
}

export default {
  ...defaults,
  ...options,
};
