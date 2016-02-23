import { createStore, applyMiddleware, compose, combineReducers as reduxCombineReducers } from 'redux';
import { syncHistory, routeReducer } from 'react-router-redux';
import { install as installLoop, combineReducers as loopCombineReducers } from 'redux-loop';
import thunk from 'redux-thunk';
import { isEmpty } from 'lodash';

export default (universal, history) => {
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
  let reactRouterReduxMiddleware;
  if (enableThunk) middleware = middleware.concat(thunk);
  if (enableReactRouterRedux && history) reactRouterReduxMiddleware = syncHistory(history);
  if (reactRouterReduxMiddleware) middleware = middleware.concat(reactRouterReduxMiddleware);

  let storeEnhancers = [];
  if (enableReduxLoop) storeEnhancers = storeEnhancers.concat(installLoop()); // this should come last, but devtools causes issue
  if (enableDevTools && __CLIENT__ && window.devToolsExtension) storeEnhancers = storeEnhancers.concat(window.devToolsExtension());

  const defaultReducer = (state = {}) => state;
  if (enableReactRouterRedux) reducers.routing = routeReducer;
  if (enableGroundControl) reducers.groundcontrol = defaultReducer;

  const combineReducers = enableReduxLoop ? loopCombineReducers : reduxCombineReducers;
  const reducer = isEmpty(reducers) ? defaultReducer : combineReducers(reducers);

  const store = createStore(reducer, initialState, compose(
    applyMiddleware(...middleware),
    ...storeEnhancers
  ));

  if (reactRouterReduxMiddleware) reactRouterReduxMiddleware.listenForReplays(store);

  return {
    reducers,
    store,
  };
};
