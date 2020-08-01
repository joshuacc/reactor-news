import React, { useEffect, useReducer } from 'react';
import './App.css';
import { api } from './api';
import { reducer, defaultState, getActionDispatchers } from './reducer';
import { StoryItem } from './components/StoryItem';

const startFetching = async (
  actions: ReturnType<typeof getActionDispatchers>
) => {
  actions.loadingList();
  const storyIds = await api.fetchInitialStories();
  actions.loadingListSuccess(storyIds);

  api.fetchStories(storyIds.slice(0, 50), {
    before: actions.loadingItem,
    after: actions.loadingItemSuccess,
  });
};

const useHnData = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const actions = getActionDispatchers(dispatch);

  useEffect(() => {
    startFetching(actions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNextStories = () => {
    if (state.newest.status !== 'SUCCESS') return;

    const firstUnfetchedIndex = state.newest.data.findIndex(
      (id) => !state.stories[id]
    );

    api.fetchStories(
      state.newest.data.slice(firstUnfetchedIndex, firstUnfetchedIndex + 50),
      {
        before: actions.loadingItem,
        after: actions.loadingItemSuccess,
      }
    );
  };

  return [state, { loadNextStories }] as const;
};

export const App = () => {
  const [state] = useHnData();

  return (
    <div style={{ maxWidth: '80ch', margin: 'auto' }}>
      <h1>Reactor News: A Hacker News Clone</h1>
      <ul>
        {state.newest.status === 'SUCCESS' &&
          state.newest.data.map((id) => (
            <StoryItem key={id} storyState={state.stories[id]} />
          ))}
      </ul>
    </div>
  );
};
