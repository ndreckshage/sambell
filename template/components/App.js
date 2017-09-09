import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from '@humblespark/react-loadable';

const Moon = Loadable({
  loader: () => import(/* webpackChunkName: "components/Moon" */'components/Moon'),
  loading: () => null,
});

const Outside = Loadable({
  loader: () => import(/* webpackChunkName: "components/Outside" */'components/Outside'),
  loading: () => null,
});

export default () =>
  <div>
    <Route exact path="/" component={Moon} />
    <Route path="/outside" component={Outside} />
    <style jsx>{`
      :global(*) { box-sizing: border-box; }
      :global(*):before, :global(*):after { box-sizing: inherit; }
      :global(body) {
        margin: 0;
        background: #FFF59D;
        font-size: 16px;
        font-family: monospace;
      }
      div {
        display: flex;
        flex-direction: column;
        padding: 20px;
        align-items: center;
        justify-content: center;
        text-transform: uppercase;
        height: 100vh;
        text-align: center;
      }
    `}</style>
  </div>
