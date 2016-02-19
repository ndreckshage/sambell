import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory as history } from 'react-router';
import GroundControl from 'ground-control';
import createStore from './createStore';
import { combineReducers as loopCombineReducers } from 'redux-loop';
import domready from 'domready';
import { universal, client } from './gerty';

const entry = require(__GERTY_ENTRY__).default;

const createClient = () => {
  const {
    mount, redux: enableRedux,
    reactRouter: enableReactRouter,
    groundControl: enableGroundControl,
    reduxLoop: enableReduxLoop,
  } = universal;

  domready(() => {
    let store, reducers; // eslint-disable-line
    if (enableRedux) {
      const storeAndReducers = createStore(universal, history);
      reducers = storeAndReducers.reducers;
      store = storeAndReducers.store;
    }

    if (enableReactRouter) {
      let routerProps = { routes: entry, history };
      if (enableGroundControl) {
        let groundControlsOpts = { store, reducers };
        if (enableReduxLoop) groundControlsOpts = { ...groundControlsOpts, combineReducers: loopCombineReducers };
        routerProps = { ...routerProps, render: props => <GroundControl {...props} {...groundControlsOpts} /> };
      }

      render(<Router {...routerProps} />, document.getElementById(mount));
    } else {
      render(entry, document.getElementById(mount));
    }
  });
};

if (client.render) createClient();
