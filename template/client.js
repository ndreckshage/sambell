import React from 'react';
import { render } from 'react-dom';
import domready from 'domready';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import App from 'App';

domready(() => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('lunar-industries')
  );
});
