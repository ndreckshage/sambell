import { createStore, applyMiddleware, compose, combineReducers as reduxCombineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { install as installLoop, combineReducers as loopCombineReducers } from 'redux-loop';
import thunk from 'redux-thunk';
import { isEmpty } from 'lodash';

export default (universal) => {
  const {
    reduxThunk: enableThunk,
    reduxLoop: enableReduxLoop,
    reactRouterRedux: enableReactRouterRedux,
    groundControl: enableGroundControl,
    reduxDevTools: enableDevTools,
    initialState,
    reducers,
  } = universal;

  let middleware = [];
  if (enableThunk) middleware = middleware.concat(thunk);

  let storeEnhancers = [];
  if (enableReduxLoop) storeEnhancers = storeEnhancers.concat(installLoop()); // this should come last, but devtools causes issue
  if (enableDevTools && __CLIENT__ && window.devToolsExtension) storeEnhancers = storeEnhancers.concat(window.devToolsExtension());

  const defaultReducer = (state = {}) => state;
  if (enableReactRouterRedux) reducers.routing = routerReducer;
  if (enableGroundControl) reducers.groundcontrol = defaultReducer;

  const combineReducers = enableReduxLoop ? loopCombineReducers : reduxCombineReducers;
  const reducer = isEmpty(reducers) ? defaultReducer : combineReducers(reducers);

  const store = createStore(reducer, initialState, compose(
    applyMiddleware(...middleware),
    ...storeEnhancers
  ));

  return {
    reducers,
    store,
  };
};
