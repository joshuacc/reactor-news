import React, { useEffect, useReducer } from 'react';
import './App.css';
import { api } from './api';
import { reducer, defaultState } from './reducer';

export const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  useEffect(() => {
    api
      .fetchStories()
      .then((l) => dispatch({ type: 'LOADING_LIST_SUCCESS', list: l }));
  }, []);
  return (
    <div style={{ maxWidth: '80ch', margin: 'auto' }}>
      <h1>Reactor News: A Hacker News Clone</h1>
      <ul>
        {state.newest.status === 'SUCCESS' &&
          state.newest.data.map((n) => <li>{n}</li>)}
      </ul>
    </div>
  );
};
