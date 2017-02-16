import React from 'react';
import express from 'express';
import { CLIENT_ENTRY, CLIENT_OUTPUT_DIR, WEBPACK_PUBLIC_PATH } from 'sambell/env';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import flush from 'styled-jsx/server';
import App from 'App';

const template = (__html, styles) =>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>sambell</title>
      {styles}
      <script type="text/javascript" src={`${WEBPACK_PUBLIC_PATH}${CLIENT_ENTRY}`} async></script>
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{ __html }} />
    </body>
  </html>

const renderApp = (req, res) => {
  const app = renderToString(<StaticRouter location={req.url} context={{}} children={<App />} />);
  const html = renderToStaticMarkup(template(app, flush()));
  res.status(200).send(`<!doctype html>${html}`);
};

express()
  .use(WEBPACK_PUBLIC_PATH, express.static(CLIENT_OUTPUT_DIR))
  .use('/static/', express.static('static'))
  .get('*', renderApp)
  .listen(3000);
