import React from 'react';
import { Link } from 'react-router-dom';

export default () =>
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
