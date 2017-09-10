import React from 'react';
import { hydrate } from 'react-dom';
import domReady from 'domready';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import App from 'components/App';

domReady(() => {
  hydrate(<BrowserRouter children={<App />} />, document.getElementById('lunar-industries'));
});
