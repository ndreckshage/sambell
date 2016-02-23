import React from 'react';
import { Route, IndexRoute, Link } from 'react-router';

const Layout = props => (
  <div>
    <div>
      <Link to="/">Page 1</Link>
      <Link to="/page-2">Page 2</Link>
    </div>
    {props.children}
  </div>
);

const reducer = (state = { counter: 0 }, action) => {
  if (action.type === 'incr') return { ...state, counter: state.counter + 1 };
  return state;
};

const PageOne = props => {
  const { dispatch, data: { counter } } = props;
  const incr = () => { dispatch({ type: 'incr' }); };
  return (
    <div>
      <p>Page 1</p>
      <p>Counter {counter}</p>
      <button onClick={incr}>+</button>
    </div>
  );
};

const PageTwo = () => <div><p>Page 2</p></div>;

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={PageOne} reducer={reducer} />
    <Route path="/page-2" component={PageTwo} />
  </Route>
);
