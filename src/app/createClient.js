import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory as history } from 'react-router';
// import GroundControl from 'ground-control';
// import createStore from './createStore';
// import { combineReducers as loopCombineReducers } from 'redux-loop';
import domready from 'domready';
import { universal } from './gerty';

let entry;
if (__GERTY_ENTRY__) {
  entry = require(__GERTY_ENTRY__).default;
} else {
  throw new Error('No entry file found!');
}

// additionalReducers, enableReactRouterRedux, enableDevTools, enableThunk, enableLoop, routes,
const createClient = () => {
  const { mount, reactRouter } = universal;
  console.log('createClient!', universal)

  domready(() => {
    // const { store, reducers } = createStore({
    //   additionalReducers, enableReactRouterRedux, enableDevTools, enableThunk, enableLoop, history,
    // });
    //
    // let groundControlsOpts = { store, reducers };
    // if (enableLoop) groundControlsOpts = { ...groundControlsOpts, combineReducers: loopCombineReducers };
    // const groundControlProps = props => ({ ...props, ...groundControlsOpts });
    //
    // const routerProps = () => ({
    //   routes, history, render: props => {
    //     return <GroundControl {...groundControlProps(props)} />;
    //   },
    // });

    let app;
    if (reactRouter) {
      const routerProps = { routes: entry, history };
      app = <Router {...routerProps} />;
    } else {
      app = entry;
    }

    render(app, document.getElementById(mount));
  });
};

createClient();
