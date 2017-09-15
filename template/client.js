import { scriptsReady } from 'sambell/client';

// @NOTE
// sambellReady tells us all our async chunks have loaded.
// all other files can use es6 module imports. this cant for async module load reasons.
// you likely will not need to touch this file.

scriptsReady(() => {
  const React = require('react');
  const { hydrate } = require('react-dom');
  const domReady = require('domready');
  const { BrowserRouter } = require('react-router-dom');
  const App = require('components/App').default;

  domReady(() => {
    hydrate(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('lunar-industries'),
    );
  });
});
