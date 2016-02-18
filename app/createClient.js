import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory as history } from 'react-router';
import routes from 'index';
// import GroundControl from 'ground-control';
// import createStore from './createStore';
// import { combineReducers as loopCombineReducers } from 'redux-loop';
import domready from 'domready';
import { universal } from './gerty';

// additionalReducers, enableReactRouterRedux, enableDevTools, enableThunk, enableLoop, routes,
const createClient = () => {
  const { mount } = universal;

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

    const routerProps = {
      routes, history,
    };

    render(<Router {...routerProps} />, document.getElementById(mount));
  });
};

createClient();
