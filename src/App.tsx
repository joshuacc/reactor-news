import React, { useEffect, useReducer, useRef } from 'react';
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

  console.log('in the hook');
  const loadNextStories = () => {
    console.log('hi');
    if (state.newest.status !== 'SUCCESS') return;

    const firstUnfetchedIndex = state.newest.data.findIndex(
      (id) => !state.stories[id]
    );

    console.log('firstUnfetcedIndex', firstUnfetchedIndex);

    if (firstUnfetchedIndex > -1) {
      api.fetchStories(
        state.newest.data.slice(firstUnfetchedIndex, firstUnfetchedIndex + 25),
        {
          before: actions.loadingItem,
          after: actions.loadingItemSuccess,
        }
      );
    }
    console.log(
      'firstUnfetchedIndex + 25 >= state.newest.data.length',
      firstUnfetchedIndex + 25,
      state.newest.data.length
    );
    if (firstUnfetchedIndex + 25 >= state.newest.data.length) {
      actions.growList(25);
    }
  };

  return { state, loadNextStories } as const;
};

export const App = () => {
  const { state, loadNextStories } = useHnData();
  const loadingRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (!loadingRef.current) return;

    const observer = new IntersectionObserver(([observerEntry]) => {
      if (state.loading || !observerEntry.isIntersecting) return;
      loadNextStories();
    });

    observer.observe(loadingRef.current);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.newest.status, state.loading]);

  return (
    <div style={{ maxWidth: '80ch', margin: 'auto' }}>
      <h1>Reactor News: A Hacker News Clone</h1>
      <ul>
        {state.newest.status === 'SUCCESS' &&
          state.newest.data.map((id) => (
            <StoryItem key={id} storyState={state.stories[id]} />
          ))}
        <li ref={loadingRef}>Loading...</li>
      </ul>
    </div>
  );
};
