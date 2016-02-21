// See all options @ https://github.com/ndreckshage/sambell/blob/master/src/app/gerty.defaults.js

const dev = { apiEndpoint: 'hello' };
const prod = { ...dev };
export const env = { dev, prod };
// import { env } from 'sambell';
// const { apiEndpoint } = env;

export const client = { render: true };
export const server = { render: true };

export const universal = {
  reactRouter: true,
  groundControl: true,
};
