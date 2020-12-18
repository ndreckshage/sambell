# DEPRECATED

This project is deprecated. Use next.js, etc.

---

# :new_moon::new_moon::new_moon: sambell :new_moon::new_moon::new_moon:
create performant server-rendered React applications with no build configuration; ideal for universal react-router projects.

- similar to [create-react-app](https://github.com/facebookincubator/create-react-app), but server side rendering.
- similar to [next.js](https://github.com/zeit/next.js), but with [react-router](https://github.com/ReactTraining/react-router).
- `sambell` came first! commit history proof :stuck_out_tongue_closed_eyes:

Both [create-react-app](https://github.com/facebookincubator/create-react-app) and [next.js](https://github.com/zeit/next.js) are great projects, try them! I like aspects of both. But you don't get a **universal react-router** application out of the box.

## What will my app look like?!?

Check out [the template](template)!

## Install

```
yarn global add sambell
sambell new app
cd app
yarn start
```

## Features

**Dev experience**

- Everything you (or at least, I) want without setting anything up!
- Client side SPA with [react-router](https://github.com/ReactTraining/react-router) **version 4**.
- [styled-jsx](https://github.com/zeit/styled-jsx) is a great feature of Next.js that I bring in here. I find it to be more pleasant than `css-modules`, and eaiser to work with for a universal application (critical styles, etc).

**Performant**

- React **16**
- Server side rendering. Universal.
- Critical styles with [styled-jsx](https://github.com/zeit/styled-jsx).
- Async loading of routes with `react-loadable` (forked version `@humblespark/react-loadable`).
- Async (`<script async />`) loading of all webpack scripts.
- Webpack build optimized for production.

**Async components**

- Full client & server side support for async loading components, with `react-loadable`
- Forked version (`@humblespark/react-loadable`) to work with server side webpack build & a fix for checksum mismatch.

```
const Moon = Loadable(() => import(/* webpackChunkName: "components/Moon" */'components/Moon'));
```

**Webpack / Babel**

- Webpack 2 (code splitting, tree shaking, etc).
- Webpack runs for **both** client and server code.
- Minimal loaders (only a JS loader). But it is configurable if you want to add more.
- **absolute path** requires from your project root. `import App from 'App'`.
- Sourcemaps for client & server.
- Babel Presets: es2015, stage-1, react
- Babel Plugins: [styled-jsx](https://github.com/zeit/styled-jsx)
- Polyfills: `isomorphic-fetch`, `babel-polyfill`

**Configurable**

\**gerty.js* (basic configuration to control where stuff goes)

```javascript
module.exports = {
  clientEntry: 'client',
  serverEntry: 'server',
  clientOutputDirectory: '.sambell/client',
  serverOutputDirectory: '.sambell/server',
  publicPath: '/static/webpack/',
  webpack: config => config,
};
```

:rocket: -> :no_entry_sign: :earth_americas:

:alien:
