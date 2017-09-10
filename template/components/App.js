import React from 'react';
import { Route } from 'react-router-dom';
import BaseLoadable from '@humblespark/react-loadable';

const Loading = (props, context) => {
  if (props.error) console.error(props.error);
  return null;
};

const Loadable = loader => BaseLoadable({ loader, loading: Loading });

const Moon = Loadable(() => import(/* webpackChunkName: "components/Moon" */'components/Moon'));
const Outside = Loadable(() => import(/* webpackChunkName: "components/Outside" */'components/Outside'));

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
