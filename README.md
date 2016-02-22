# Create a universal, single page app with a single file.

- Quickly prototype. Focus on app code, not initial setup.
- No eslintrc, babelrc, package.json, node_modules, webpack setup. All behind the scenes!
- Not a 'starter kit', where you are thrown into a semi-big project right off the bat.
- Start with 1 file, and incrementally add complexity.
- [Example!](https://github.com/ndreckshage/sambell-example)

## Install
```
npm i -g sambell
```

## Step 1 (1 file)
```
sambell new app.js
sambell run app.js
```

And you have a universal, single page app! **1 FILE!**

## Step 2 (Basic structure)
```
sambell wrap app.js
```

And you have a basic project structure with a package.json, gerty.js (to configure sambell).

## Step 3 (Add more with a few flags / whatever you want)
```
sambell add --local --eslint --git
npm i --save immutable
```

## What you get!
- Server side rendering setup (src/app/createServer)
- Client side rendering w/ data from server (src/app/createClient)
- Redux store creation w/ a few enhancers (src/app/createStore)
- Webpack setup for client & server code (src/webpack/gulpfile)
- Babel with babel-preset-es2015; babel-preset-stage-0; babel-preset-react
- Absolute path requires from your app root (```import routes from 'routes'```)
- CLI with a few comments (new; run; wrap; add -- src/bin, better documentation coming)
- Everything behind the scenes, just focus on app code for a quick prototype!
