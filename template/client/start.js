import React from 'react';
import { render } from 'react-dom';
import domReady from 'domready';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import App from 'components/App';

domReady(() => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('lunar-industries')
  );
});
