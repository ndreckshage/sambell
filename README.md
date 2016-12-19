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
- webpack 2 (tree shaking, code splitting, etc)
- server side rendering
- critical styles with `react-ssr-critical-styles`
- babel (es2015, stage-1, react)
- loaders (css, style (with isomorphic support), image)
- polyfills (babel, isomorphic-fetch)
- configurable! add `webpack.overrides.js` to your project root & add whatever loaders you want, etc.*

todo:
- [x] polyfills (isomorphic-fetch etc)
- [ ] eslint (airbnb)
- [x] react-router example
- [ ] react-router-auth0 example
- [ ] react-router-auth0-apollo example

examples:
- 1 sambell-w-react-router https://github.com/HumbleSpark/sambell-w-react-router
- 2 sambell-w-react-router-auth0
- 3 sambell-w-react-router-auth0-apollo

* webpack.overrides.js
```
module.exports = (config) => {
  config.devtool = 'eval';
  return config;
}
```
