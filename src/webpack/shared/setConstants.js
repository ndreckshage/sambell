const isClient = typeof window !== 'undefined';

export default () => ({
  __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  __CLIENT__: JSON.stringify(isClient),
  __SERVER__: JSON.stringify(!isClient),
});
