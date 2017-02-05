import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { GatherCriticalStyles, stringifyStyles } from 'react-ssr-critical-styles';
import App from 'App';

const template = (content = '', criticalStyles = '') => {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>sambell</title>
        <script type="text/javascript" src="/sambell/${process.env.SAMBELL_CLIENT_ENTRY || 'run.js'}" async></script>
        <style id="critical-styles">${criticalStyles}</style>
      </head>
      <body>
        <div id="root">${content}</div>
      </body>
    </html>
  `;
};

const renderApp = (req, res) => {
  let criticalStyles = [];
  const content = renderToString(
    <GatherCriticalStyles addCriticalStyles={(s) => criticalStyles.push(s)}>
      <App />
    </GatherCriticalStyles>
  );

  res.status(200).send(template(content, stringifyStyles(criticalStyles)));
};

express()
  .use('/sambell/', express.static('.sambell/client'))
  .use('/static/', express.static('static'))
  .get('*', renderApp)
  .listen(3000);
