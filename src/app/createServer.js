import 'babel-polyfill';
import 'isomorphic-fetch';

import chalk from 'chalk';
import path from 'path';
import React from 'react';
import express from 'express';
import { CLIENT_OUTPUT_DIR, CLIENT_PUBLIC_MOUNT, CLIENT_FILENAME } from './../webpack/constants';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import GroundControl, { loadStateOnServer } from 'ground-control';
import { combineReducers as loopCombineReducers } from 'redux-loop';
import createStore from './createStore';
import { universal, server, client } from './gerty';

const entry = require(__GERTY_ENTRY__).default;

const clientOutputDir = path.join(__dirname, '..', '..', CLIENT_OUTPUT_DIR);

const getHtml = (html = '', scriptString = '') => {
  const { mount } = universal;
  const { render: enableClientRender } = client;

  return (
    `<!DOCTYPE html>
    <html>
      <head>${enableClientRender ? `<script src="${CLIENT_PUBLIC_MOUNT}/${CLIENT_FILENAME}" async></script>` : ''}</head>
      <body><div id="${mount}">${html}</div>${scriptString}</body>
    </html>`
  );
};

const getAppHtml = (props, store, initialData, reducers, enableLoop) => {
  let groundControlOpts = { store, initialData, reducers };
  if (enableLoop) groundControlOpts = { ...groundControlOpts, combineReducers: loopCombineReducers };
  const groundControlProps = { ...props, ...groundControlOpts };
  return renderToString(<GroundControl {...groundControlProps} />);
};

const render = (req, res) => {
  const {
    redux: enableRedux,
    reactRouter: enableReactRouter,
    groundControl: enableGroundControl,
    reduxLoop: enableReduxLoop,
  } = universal;

  let store, reducers; // eslint-disable-line
  if (enableRedux) {
    const storeAndReducers = createStore(universal);
    reducers = storeAndReducers.reducers;
    store = storeAndReducers.store;
  }

  if (enableReactRouter) {
    match({
      routes: entry, location: req.url,
    }, (
      routingErr, routingRedirectLocation, renderProps
    ) => {
      if (routingErr) {
        res.status(500).send(routingErr.message);
      } else if (routingRedirectLocation) {
        res.redirect(302, `${routingRedirectLocation.pathname}${routingRedirectLocation.search}`);
      } else if (renderProps) {
        if (enableRedux && enableGroundControl) {
          let serverOpts = { props: renderProps, store, reducers };
          if (enableReduxLoop) serverOpts = { ...serverOpts, combineReducers: loopCombineReducers };

          loadStateOnServer(
            serverOpts, (
              loadDataErr, loadDataRedirectLocation, initialData, scriptString
            ) => {
              if (loadDataErr) {
                res.status(500).send(loadDataErr.message);
              } else if (loadDataRedirectLocation) {
                res.redirect(302, `${loadDataRedirectLocation.pathname}${loadDataRedirectLocation.search}`);
              } else {
                const appHtml = getAppHtml(renderProps, store, initialData, reducers, enableReduxLoop);
                const html = getHtml(appHtml, scriptString);
                res.status(200).send(html);
              }
            }
          );
        } else {
          res.status(200).send(renderToString(<RouterContext {...renderProps} />));
        }
      } else {
        res.status(404).send('Not found');
      }
    });
  } else {
    res.status(200).send(renderToString(entry));
  }
};

const createServer = () => {
  const { port, render: enableServerRender } = server;

  let finalRender = (req, res) => res.status(200).send(getHtml());
  if (enableServerRender) finalRender = render;

  const app = express();
  app.use(CLIENT_PUBLIC_MOUNT, express.static(clientOutputDir));
  app.get('*', finalRender);
  app.listen(port, () => {
    console.log(chalk.cyan(`Server listening on port ${port}`)); // eslint-disable-line
  });
};

createServer();
