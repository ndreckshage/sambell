import React from 'react';
import { render } from 'react-dom';
import domReady from 'domready';
import sambellReady from 'sambell/ready';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import App from 'App';

sambellReady(() => {
  domReady(() => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('lunar-industries')
    );
  });
});
