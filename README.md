# sambell
sambell is a minimal framework for server-rendered React applications, ideal for universal react-router projects.

- similar to [create-react-app](https://github.com/facebookincubator/create-react-app), but server side rendering.
- similar to [next.js](https://github.com/zeit/next.js), but with [react-router](https://github.com/ReactTraining/react-router).
- `sambell` came first! commit history proof :stuck_out_tongue_closed_eyes:

Both [create-react-app](https://github.com/facebookincubator/create-react-app) and [next.js](https://github.com/zeit/next.js) are great projects, try them! I like aspects of both. But you don't get a **universal react-router** application out of the box.

###### Why not Next?

I think [next.js](https://github.com/zeit/next.js) is great, with one big flaw: you don't get a layout file. The entire application re-renders on route changes. This makes things like animated transitions impossible. But even something simple like a **material design ink button** link won't work, because the re-render kills the button animation. I think [react-router](https://github.com/ReactTraining/react-router) is fundamentally more powerful, and opt for that.

## Install

```
yarn global add sambell
sambell new my-app
cd my-app
yarn start
```

## Features

**Performant**

- Server side rendering. Universal.
- Critical styles with [styled-jsx](https://github.com/zeit/styled-jsx)

**Webpack**

- Webpack 2 (code splitting, tree shaking, etc).
- Webpack runs for **both** client and server code.
- Minimal loaders (only a JS loader). But it is configurable if you want to add more.
- **absolute path** requires from your project root. `import App from 'App'`

**Babel**

- Presets: es2015, stage-1, react
- Plugins: [styled-jsx](https://github.com/zeit/styled-jsx)

**Router**
- Client side SPA with [react-router](https://github.com/ReactTraining/react-router) **version 4**.
- Easy to add non-v4 react-router if you prefer that. But v4 is really nice if starting a new project.

**CSS**

- [styled-jsx](https://github.com/zeit/styled-jsx) is a great feature of Next.js that I bring in here. I find it to be more pleasant than `css-modules`, and eaiser to work with for a universal application (critical styles, etc).

**Other**

- Polyfills: isomorphic-fetch, babel-polyfill

**Configurable**

- You get a `server.js` file. You have full control over client and server.
- Add a `gerty.js` file to your project root.

\**gerty.js*

```
// @NOTE this file is not compiled, use only whats available in your node version. Webpack config only right now.

module.exports = {
  webpack: (config, { dev, node }) => {
    config.devtool = 'eval';
    return config;
  },
};
```
