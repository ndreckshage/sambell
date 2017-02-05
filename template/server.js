import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { GatherCriticalStyles, stringifyStyles } from 'react-ssr-critical-styles';
import App from 'App';

const template = (src, content = '', criticalStyles = '') => {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>sambell</title>
        <script type="text/javascript" src="${src}" async></script>
        <style id="critical-styles">${criticalStyles}</style>
      </head>
      <body>
        <div id="root">${content}</div>
      </body>
    </html>
  `;
};

const assetMount = express.static(process.env.SAMBELL_CLIENT_OUTPUT_DIR);
const renderApp = (req, res) => {
  let criticalStyles = [];
  const content = renderToString(
    <GatherCriticalStyles addCriticalStyles={(s) => criticalStyles.push(s)}>
      <App />
    </GatherCriticalStyles>
  );

  res.status(200).send(template(process.env.SAMBELL_CLIENT_ENTRY, content, stringifyStyles(criticalStyles)));
};

express()
  .use('/assets/', assetMount)
  .get('*', renderApp)
  .listen(3000);
