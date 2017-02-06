import React from 'react';
import { Route, Link } from 'react-router-dom';

const Moon = () =>
  <div>
    <p className="WakeMe">Wake me</p>
    <p className="WhenIts">{`When it's quitting time`}</p>
    <Link to="/outside">Go outside.</Link>
    <style jsx>{`
      .WakeMe {
        color: #B71C1C;
        font-size: 8rem;
        margin: 0;
      }
      .WhenIts {
        color: #111;
        font-size: 2rem;
      }
    `}</style>
  </div>

const Outside = () => <div>{`I can't let you go outside, Sam.`} <Link to="/">Go Home</Link>.</div>

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
