// import React from 'react';
// import { render } from 'react-dom';
// import { Router, browserHistory as history } from 'react-router';
// import GroundControl from 'ground-control';
// import createStore from './createStore';
// import { combineReducers as loopCombineReducers } from 'redux-loop';
import domready from 'domready';

// additionalReducers, enableReactRouterRedux, enableDevTools, enableThunk, enableLoop, routes,
export default () => {
  domready(() => {
    console.log('client reading..!');
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
    //
    // render(<Router {...routerProps()} />, document.getElementById('app'));
  });
};
