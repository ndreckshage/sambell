// See all options/defaults @ https://github.com/ndreckshage/sambell/blob/master/src/app/gerty.defaults.js

const dev = { apiEndpoint: 'hello' };
const prod = { ...dev };
export const env = { dev, prod };
// then... import { env } from 'sambell';
// and... const { apiEndpoint } = env;

export const client = { render: true }; // render react on client (recommended!)
export const server = { render: true }; // render react on server (recommended, but optional)

export const universal = {
  reactRouter: true, // https://github.com/reactjs/react-router
  groundControl: true, // https://github.com/raisemarketplace/ground-control
};
