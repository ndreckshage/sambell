import 'babel-polyfill';

import React, { createElement } from 'react';
import { render } from 'react-dom';
import { Router, browserHistory, hashHistory } from 'react-router';
import GroundControl from 'ground-control';
import createStore from './createStore';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { combineReducers as loopCombineReducers } from 'redux-loop';
import domready from 'domready';
import { universal, client } from './gerty';

const entry = require(__GERTY_ENTRY__).default;

const createClient = () => {
  const {
    mount, redux: enableRedux,
    reactRouter: enableReactRouter,
    groundControl: enableGroundControl,
    reactRouterRedux: enableReactRouterRedux,
    reduxLoop: enableReduxLoop,
  } = universal;

  const { html5History } = client;
  let history = browserHistory;
  if (!html5History) history = hashHistory;

  domready(() => {
    let store, reducers; // eslint-disable-line
    if (enableRedux) {
      const storeAndReducers = createStore(universal);
      reducers = storeAndReducers.reducers;
      store = storeAndReducers.store;

      if (enableReactRouterRedux) {
        history = syncHistoryWithStore(history, store);
      }
    }

    let container;
    if (enableReactRouter) {
      let routerProps = { routes: entry, history };
      if (enableRedux && enableGroundControl) {
        let groundControlsOpts = { store, reducers };
        if (enableReduxLoop) groundControlsOpts = { ...groundControlsOpts, combineReducers: loopCombineReducers };
        routerProps = { ...routerProps, render: props => <GroundControl {...props} {...groundControlsOpts} /> };
      }

      container = <Router {...routerProps} />;
    } else {
      container = createElement(entry);
    }

    let finalContainer;
    if (enableRedux) {
      finalContainer = <Provider store={store} children={container} />;
    } else {
      finalContainer = container;
    }

    render(finalContainer, document.getElementById(mount));
  });
};

if (client.render) createClient();
