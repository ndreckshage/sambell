import { createStore, applyMiddleware, compose, combineReducers as reduxCombineReducers } from 'redux';
import { syncHistory, routeReducer } from 'react-router-redux';
import { install as installLoop, combineReducers as loopCombineReducers } from 'redux-loop';
import thunk from 'redux-thunk';

export default (universal, history) => {
  const {
    reduxThunk: enableThunk,
    reduxLoop: enableReduxLoop,
    reactRouterRedux: enableReactRouterRedux,
    groundControl: enableGroundControl,
    reduxDevTools: enableDevTools,
  } = universal;

  let middleware = [];
  let reactRouterReduxMiddleware;
  if (enableThunk) middleware = middleware.concat(thunk);
  if (enableReactRouterRedux && history) reactRouterReduxMiddleware = syncHistory(history);
  if (reactRouterReduxMiddleware) middleware = middleware.concat(reactRouterReduxMiddleware);

  let storeEnhancers = [];
  if (enableReduxLoop) storeEnhancers = storeEnhancers.concat(installLoop()); // this should come last, but devtools causes issue
  if (enableDevTools && typeof window !== 'undefined') storeEnhancers = storeEnhancers.concat(window.devToolsExtension ? window.devToolsExtension() : f => f);

  const reducers = {};
  const defaultReducer = (state = {}) => state;
  if (enableReactRouterRedux) reducers.routing = routeReducer;
  if (enableGroundControl) reducers.groundcontrol = defaultReducer;

  const combineReducers = enableReduxLoop ? loopCombineReducers : reduxCombineReducers;
  const reducer = combineReducers(reducers);

  const store = createStore(reducer, {}, compose(
    applyMiddleware(...middleware),
    ...storeEnhancers
  ));

  if (reactRouterReduxMiddleware) reactRouterReduxMiddleware.listenForReplays(store);

  return { store, reducers };
};
