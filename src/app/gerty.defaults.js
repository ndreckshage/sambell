const dev = {};
const prod = { ...dev };
export const env = { dev, prod };

export const client = {
  render: true,
  html5History: true,
};

export const server = {
  render: true,
  port: 3000 || process.env.PORT,
};

export const universal = {
  mount: 'root',
  redux: true,
  reducers: {},
  initialState: {},
  reduxDevTools: true,
  reactRouter: true,
  reactRouterRedux: true,
  groundControl: true,
  reduxThunk: false,
  reduxLoop: false,
};
