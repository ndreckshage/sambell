import React from 'react';
import { render } from 'react-dom';
import { RemoveCriticalStyles } from 'react-ssr-critical-styles';
import App from 'App';

render((
  <RemoveCriticalStyles styleId="critical-styles">
    <App />
  </RemoveCriticalStyles>
), document.getElementById('root'));
