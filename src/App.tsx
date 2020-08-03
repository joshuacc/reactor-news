import React, { useRef, useCallback } from 'react';
import './App.css';
import { StoryItem } from './components/StoryItem';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { useHnData } from './hooks/useHnData';
import { Spinner } from './components/Spinner';

export const App = () => {
  const { state, loadNextStories } = useHnData();
  const loadingRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    if (state.loading) return;
    loadNextStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.loading]);

  useIntersectionObserver(loadingRef.current, load, [
    state.newest.status,
    state.loading,
  ]);

  return (
    <div className="content">
      <h1>Reactor News: A Hacker News Clone</h1>
      <ul>
        {state.newest.status === 'SUCCESS' &&
          state.newest.data.map((id) => (
            <StoryItem key={id} storyState={state.stories[id]} />
          ))}
      </ul>
      <div ref={loadingRef}>
        <Spinner />
      </div>
    </div>
  );
};
