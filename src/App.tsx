import React, { useEffect, useReducer } from 'react';
import './App.css';
import { api } from './api';
import { reducer, defaultState } from './reducer';
import { StoryItem } from './components/StoryItem';

export const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  useEffect(() => {
    (async () => {
      dispatch({ type: 'LOADING_LIST' });
      const storyIds = await api.fetchInitialStories();
      dispatch({ type: 'LOADING_LIST_SUCCESS', list: storyIds });

      storyIds.slice(0, 50).forEach(async (id) => {
        dispatch({ type: 'LOADING_ITEM', id });
        const story = await api.fetchStory(id);
        dispatch({ type: 'LOADING_ITEM_SUCCESS', story });
      });
    })();
  }, []);
  return (
    <div style={{ maxWidth: '80ch', margin: 'auto' }}>
      <h1>Reactor News: A Hacker News Clone</h1>
      <ul>
        {state.newest.status === 'SUCCESS' &&
          state.newest.data.map((id) => (
            <StoryItem storyState={state.stories[id]} />
          ))}
      </ul>
    </div>
  );
};
