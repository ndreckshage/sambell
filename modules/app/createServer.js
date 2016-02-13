import 'isomorphic-fetch';
//
// import React from 'react';
import express from 'express';
// import { match } from 'react-router';
// import { partial } from 'lodash';
// import { renderToString } from 'react-dom/server';
// import GroundControl, { loadStateOnServer } from 'ground-control';
// import { combineReducers as loopCombineReducers } from 'redux-loop';
// import createStore from './createStore';

const getHtml = (enableClientRender, html = 'hello!!', scriptString = '') => {
  return (
    `<!DOCTYPE html>
    <html>
      <head>${enableClientRender ? `<script src="/__build__/bundle.js" async></script>` : ''}</head>
      <body style='margin:0;padding:0;'>
        <div id="app" style='padding:20px;box-sizing:border-box;'>${html}</div>
        ${scriptString}
      </body>
    </html>`
  );
};

// const getAppHtml = (props, store, initialData, reducers, enableLoop) => {
//   // only props, store, initialData are required
//   let groundControlOpts = { store, initialData, reducers };
//   if (enableLoop) groundControlOpts = { ...groundControlOpts, combineReducers: loopCombineReducers };
//   const groundControlProps = () => ({ ...props, ...groundControlOpts });
//   return renderToString(<GroundControl {...groundControlProps()} />);
// };
//
// const render = ({ routes, additionalReducers, enableThunk, enableLoop, enableClientRender }, req, res) => {
//   match({ routes, location: req.url }, (routingErr, routingRedirectLocation, props) => {
//     if (routingErr) {
//       res.status(500).send(routingErr.message);
//     } else if (routingRedirectLocation) {
//       res.redirect(302, `${routingRedirectLocation.pathname}${routingRedirectLocation.search}`);
//     } else if (props) {
//       const { store, reducers } = createStore({ additionalReducers, enableThunk, enableLoop });
//       let serverOpts = { props, store, reducers };
//       if (enableLoop) serverOpts = { ...serverOpts, combineReducers: loopCombineReducers };
//
//       loadStateOnServer(serverOpts, (loadDataErr, loadDataRedirectLocation, initialData, scriptString) => {
//         if (loadDataErr) {
//           res.status(500).send(loadDataErr.message);
//         } else if (loadDataRedirectLocation) {
//           res.redirect(302, `${loadDataRedirectLocation.pathname}${loadDataRedirectLocation.search}`);
//         } else {
//           const appHtml = getAppHtml(props, store, initialData, reducers, enableLoop);
//           const html = getHtml(enableClientRender, appHtml, scriptString);
//           res.status(200).send(html);
//         }
//       });
//     } else {
//       res.status(404).send('Not found');
//     }
//   });
// };

// additionalReducers, enableServerRender, enableClientRender, enableThunk, enableLoop, routes,
export default () => {
  const enableClientRender = true;
  const enableServerRender = false;
  let finalRender = (req, res) => res.status(200).send(getHtml(enableClientRender));
  // if (enableServerRender) finalRender = partial(render, { routes, additionalReducers, enableThunk, enableLoop, enableClientRender });

  express().get('*', finalRender).listen(8081, () => {
    console.log('Server started: 8081'); // eslint-disable-line
  });
};
