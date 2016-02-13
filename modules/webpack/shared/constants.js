const { env: { NODE_ENV } } = process;

export default {
  __DEV__: JSON.stringify(NODE_ENV === 'development'),
  __PROD__: JSON.stringify(NODE_ENV === 'production'),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
};
