const dev = {};
const prod = { ...dev };
export const env = { dev, prod };

export const client = {
  render: true,
  // codeSplitting: true, @TODO
  // sourcemap: 'sourcemap', @TODO
  // history: 'browser', @TODO
};

export const server = {
  render: true,
  port: 3000 || process.env.PORT,
};

export const universal = {
  mount: 'root',
  redux: true,
  reactRouter: true,
  reactRouterRedux: true,
  reduxDevTools: true,
  groundControl: true,
  reduxThunk: true,
  // reduxLoop: true, @TODO
};
