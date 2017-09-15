import React from 'react';
import express from 'express';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { renderScripts } from 'sambell/server';
import flushCriticalStyles from 'styled-jsx/server';
import { flush as flushLoadable } from '@humblespark/react-loadable';
import StaticRouter from 'react-router-dom/StaticRouter';
import App from 'components/App';
import gerty from './gerty';

const template = (content, criticalStyles, asyncChunks) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>sambell</title>
      {criticalStyles}
      {renderScripts(asyncChunks)}
    </head>
    <body
      children={
        <div
          id="lunar-industries"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      }
    />
  </html>
);

const renderApp = (req, res) => {
  const context = {};
  const content = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>,
  );

  if (context.url) return res.redirect(context.url);

  res
    .status(200)
    .send(
      `<!doctype html>${renderToStaticMarkup(
        template(
          content,
          flushCriticalStyles(),
          flushLoadable().map(md => md.importedModulePath),
        ),
      )}`,
    );
};

express()
  .use(gerty.publicPath, express.static(gerty.clientOutputDirectory))
  .use('/static/', express.static('static'))
  .get('*', renderApp)
  .listen(process.env.PORT || 3000);
