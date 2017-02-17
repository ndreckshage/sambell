import React from 'react';
import express from 'express';
import compression from 'compression';
import { CLIENT_ENTRY, CLIENT_OUTPUT_DIR, WEBPACK_PUBLIC_PATH } from 'sambell/env';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import flush from 'styled-jsx/server';
import App from 'App';

const template = (content, criticalStyles) =>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>sambell</title>
      {criticalStyles}
      <script type="text/javascript" src={`${WEBPACK_PUBLIC_PATH}${CLIENT_ENTRY}`} async></script>
    </head>
    <body>
      <div id="lunar-industries" dangerouslySetInnerHTML={{ __html: content }} />
    </body>
  </html>

const renderApp = (req, res) => {
  const context = {};
  const html = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  if (context.url) {
    res.redirect(context.url);
  } else {
    res.status(200).send(`
      <!doctype html>
      ${renderToStaticMarkup(template(html, flush()))}
    `);
  }
}

express()
  .use(compression())
  .use(WEBPACK_PUBLIC_PATH, express.static(CLIENT_OUTPUT_DIR))
  .use('/static/', express.static('static'))
  .get('*', renderApp)
  .listen(process.env.PORT || 3000);
