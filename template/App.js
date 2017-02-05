import React, { Component } from 'react';
import styles, { locals } from 'app.css';
import { addCriticalStyles } from 'react-ssr-critical-styles';

class App extends Component {
  render() {
    return (
      <div className={locals.App}>
        <p className={locals.WakeMe}>Wake me</p>
        <p className={locals.WhenIts}>{`When it's quitting time`}</p>
      </div>
    );
  }
}

export default addCriticalStyles(styles)(App);
