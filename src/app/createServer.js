import 'babel-polyfill';
import 'isomorphic-fetch';

import path from 'path';
import fs from 'fs';

import chalk from 'chalk';
import React, { createElement } from 'react';
import express from 'express';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import GroundControl, { loadStateOnServer } from 'ground-control';
import { combineReducers as loopCombineReducers } from 'redux-loop';
import createStore from './createStore';
import { universal, server, client } from './gerty';
import Helmet from 'react-helmet';

import {
  CLIENT_OUTPUT_DIR, CLIENT_PUBLIC_MOUNT,
  CLIENT_FILENAME, MINIFIED, JS_EXT,
  CSS_EXT, CSS_FILENAME,
} from './../webpack/constants';

const entry = require(__GERTY_ENTRY__).default;

const jsFilename = `${CLIENT_FILENAME}${__PROD__ ? MINIFIED : ''}${JS_EXT}`;
const cssFilename = `${CSS_FILENAME}${__PROD__ ? MINIFIED : ''}${CSS_EXT}`;
let jsExists = false;
let cssExists = false;

try {
  fs.accessSync(path.join(__OUTPUT_BASE__, CLIENT_OUTPUT_DIR, jsFilename), fs.R_OK);
  jsExists = true;
} catch (e) {} // eslint-disable-line

try {
  fs.accessSync(path.join(__OUTPUT_BASE__, CLIENT_OUTPUT_DIR, cssFilename), fs.R_OK);
  cssExists = true;
} catch (e) {} // eslint-disable-line


const getHtml = (html = '', scriptString = '') => {
  const { mount } = universal;
  const { render: enableClientRender } = client;
  const { prependHead, appendHead, styleReset: _styleReset, appendStyleReset, prependBody, appendBody } = server;
  const styleReset = _styleReset ? `<style>${_styleReset}${appendStyleReset}</style>` : '';
  const js = enableClientRender && jsExists ? `<script src="${CLIENT_PUBLIC_MOUNT}${jsFilename}" async></script>` : '';
  const css = cssExists ? `<link rel="stylesheet" type="text/css" href="${CLIENT_PUBLIC_MOUNT}${cssFilename}"></link>` : '';
  const helmet = Helmet.rewind();

  return (
    `<!DOCTYPE html>
    <html>
      <head>
        ${prependHead}
        ${styleReset}
        ${css}
        ${js}
        ${helmet.title.toString()}
        ${helmet.base.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
        ${appendHead}
      </head>
      <body>
        ${prependBody}
        <div id="${mount}">${html}</div>
        ${scriptString}
        ${appendBody}
      </body>
    </html>`
  );
};

const renderGroundControl = (req, res, renderProps, store, reducers) => {
  const { reduxLoop: enableReduxLoop } = universal;
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
        let groundControlOpts = { store, initialData, reducers };
        if (enableReduxLoop) groundControlOpts = { ...groundControlOpts, combineReducers: loopCombineReducers };
        const container = <GroundControl {...renderProps} {...groundControlOpts} />;
        const finalContainer = <Provider store={store} children={container} />;
        res.status(200).send(getHtml(renderToString(finalContainer), scriptString));
      }
    }
  );
};

const renderReactRouter = (req, res) => {
  const {
    groundControl: enableGroundControl,
    redux: enableRedux,
  } = universal;

  match({
    routes: entry, location: req.url,
  }, (routingErr, routingRedirectLocation, renderProps) => {
    if (routingErr) {
      res.status(500).send(routingErr.message);
    } else if (routingRedirectLocation) {
      res.redirect(302, `${routingRedirectLocation.pathname}${routingRedirectLocation.search}`);
    } else if (renderProps) {
      const container = <RouterContext {...renderProps} />;
      if (enableRedux) {
        const { store, reducers } = createStore(universal);
        if (enableGroundControl) {
          renderGroundControl(req, res, renderProps, store, reducers);
        } else {
          const finalContainer = <Provider store={store} children={container} />;
          res.status(200).send(getHtml(renderToString(finalContainer)));
        }
      } else {
        res.status(200).send(getHtml(renderToString(container)));
      }
    } else {
      res.status(404).send('Not found');
    }
  });
};

const render = (req, res) => {
  const {
    reactRouter: enableReactRouter,
    redux: enableRedux,
  } = universal;

  if (enableReactRouter) {
    renderReactRouter(req, res);
  } else {
    const element = createElement(entry);
    if (enableRedux) {
      const { store } = createStore(universal);
      const finalContainer = <Provider store={store} children={element} />;
      res.status(200).send(getHtml(renderToString(finalContainer)));
    } else {
      res.status(200).send(getHtml(renderToString(element)));
    }
  }
};

const createServer = () => {
  const { port, render: enableServerRender } = server;

  let finalRender = (req, res) => res.status(200).send(getHtml());
  if (enableServerRender) finalRender = render;

  const app = express();
  app.use(CLIENT_PUBLIC_MOUNT, express.static(path.join(__OUTPUT_BASE__, CLIENT_OUTPUT_DIR)));
  app.get('*', finalRender);
  app.listen(port, () => {
    console.log(chalk.cyan(`Server listening on port ${port}`)); // eslint-disable-line
  });
};

createServer();
