import React from 'react';
import express from 'express';
import compression from 'compression';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import flushCriticalStyles from 'styled-jsx/server';
import { flush as flushLoadable } from '@humblespark/react-loadable';
import StaticRouter from 'react-router-dom/StaticRouter';
import App from 'components/App';

import {
  CLIENT_WEBPACK_MANIFEST, // contents of webpack manifest to inline
  CLIENT_VENDOR_ENTRY, // vendor code in node_modules
  CLIENT_ENTRY, // our app entry
  CLIENT_CHUNKS, // code split entries
  CLIENT_OUTPUT_DIR, // output directory to mount as static
  WEBPACK_PUBLIC_PATH, // webpack public path
  waitForChunks, // instruct our loader to wait for x (possibly async) chunks before render
} from 'sambell/env';

const template = (content, criticalStyles, chunkNames) =>
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>sambell</title>
      {criticalStyles}
      <script type="text/javascript" dangerouslySetInnerHTML={{ __html: CLIENT_WEBPACK_MANIFEST }} />
      <script type="text/javascript" dangerouslySetInnerHTML={{ __html: waitForChunks(chunkNames.length + 2 /* chunks + entry + vendor */)}} />
      <script type="text/javascript" src={`${WEBPACK_PUBLIC_PATH}${CLIENT_VENDOR_ENTRY}`} async />
      <script type="text/javascript" src={`${WEBPACK_PUBLIC_PATH}${CLIENT_ENTRY}`} async />
      {chunkNames.map(cn => <script key={cn} type="text/javascript" src={`${WEBPACK_PUBLIC_PATH}${CLIENT_CHUNKS[cn]}`} async /> )}
    </head>
    <body children={<div id="lunar-industries" dangerouslySetInnerHTML={{ __html: content }} />} />
  </html>;

const renderApp = (req, res) => {
  const context = {};
  const content = renderToString(<StaticRouter location={req.url} context={context} children={<App />} />);
  if (context.url) {
    res.redirect(context.url);
  } else {
    res.status(200).send(`<!doctype html>${renderToStaticMarkup(template(
      content, flushCriticalStyles(), flushLoadable().map(md => md.importedModulePath)
    ))}`);
  }
};

express()
  .use(compression())
  .use(WEBPACK_PUBLIC_PATH, express.static(CLIENT_OUTPUT_DIR))
  .use('/static/', express.static('static'))
  .get('*', renderApp)
  .listen(process.env.PORT || 3000);
