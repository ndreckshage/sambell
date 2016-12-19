sambell 2.0.0-beta.2
create universal react apps w minimal configuration

`yarn global add sambell`
`sambell new my-app`
`yarn start`

- similar to create-react-app, but universal & configurable
- similar to next.js, but less opinionated
- came first! commit history proof :P

both create-react-app and next.js are great projects, try them. i wanted a few things i didn't get with those: universal app with react router support, css modules, critical styles.

features:
- webpack 2 (tree shaking, code splitting, etc)
- server side rendering
- critical styles with `react-ssr-critical-styles`
- babel (es2015, stage-1, react)
- loaders (css, style (with isomorphic support), image)

todo:
- [ ] eslint (airbnb)
- [ ] polyfills (isomorphic-fetch etc)
- [ ] examples (below)

examples:
- 1 sambell-w-react-router
- 2 sambell-w-react-router-auth0
- 3 sambell-w-react-router-auth0-apollo
