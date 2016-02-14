// import defaults from './gerty';
// const options = require(path.join(cwd, 'gerty.json'));
// const settings = { ...defaults, ...options }; // eslint-disable-line
// const gerty = path.join(__dirname, '..', 'app', 'gerty.json');
// fs.writeFileSync(gerty, JSON.stringify(settings), 'utf8');

const x = require(`${__ORIGINAL_CWD__}/x`).default;

const routes = x;
console.log('hello', x);

export default {
  routes,
};
