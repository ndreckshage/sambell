#sambell
create universal react apps w minimal configuration

```
yarn global add sambell
sambell new my-app
cd my-app
yarn start
```

**Look at the template folder to see what your app will look like.**

- similar to create-react-app, but universal & configurable
- similar to next.js, but less opinionated
- came first! commit history proof :P

Both `create-react-app` and `next.js` are great projects, try them. i wanted a few things i didn't get with those: universal app with react router support (not built into this by default), css modules, critical styles.

features:
- server side rendering
- critical styles with `react-ssr-critical-styles`
- webpack 2 (tree shaking, code splitting, etc)
- webpack loaders (css, style). absolute path requires from your project root.
- babel (es2015, stage-1, react).
- polyfills (babel, isomorphic-fetch).
- configurable! add `webpack.overrides.js` to your project root & add whatever loaders you want, etc.*

next:
- [ ] eslint (airbnb)
- [ ] gerty.config.js instead of webpack overrides
- [ ] hot module replacement / auto reload
- [ ] better console?

examples:
- [x] sambell-w-react-router https://github.com/HumbleSpark/sambell-w-react-router
- [ ] sambell-w-react-router-auth0
- [ ] sambell-w-react-router-auth0-apollo


\**webpack.overrides.js*

```
// @NOTE this file is not compiled, use only whats available in your node version.
module.exports = (config) => {
  config.devtool = 'eval';
  return config;
}
```
