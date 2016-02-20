# WIP - NOT READY FOR REGULAR USE

# Create a universal, single page app with a single file.

- Quickly prototype. Focus on app code, not initial setup.
- No eslintrc, babelrc, package.json, node_modules, webpack setup. All behind the scenes!
- Not a 'starter kit', where you are thrown into a semi-big project right off the bat.
- Start with 1 file, and incrementally add complexity.

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

## Step 3 (Add more)
```
sambell add --eslint --git
npm i --save immutable
```
