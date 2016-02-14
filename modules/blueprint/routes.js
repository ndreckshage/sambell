import React from 'react';
import { Route, IndexRoute } from 'react-router';

const AppComponent = ({ children }) => (
  <div>
    <p>App Layout</p>
    {children}
  </div>
);

const HomeComponent = () => (
  <div>
    <p>Home Route</p>
  </div>
);

export default (
  <Route path="/" component={AppComponent}>
    <IndexRoute component={HomeComponent} />
  </Route>
);
