import { useReducer, useEffect } from 'react';
import { getActionDispatchers, reducer, defaultState } from '../reducer';
import { api } from '../api';

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

export const useHnData = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const actions = getActionDispatchers(dispatch);

  useEffect(() => {
    startFetching(actions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNextStories = () => {
    if (state.newest.status !== 'SUCCESS') return;
    const amountToFetchWhenStoriesOnly = 25;
    const amountToFetchWhenCommentsToo = 100;

    // Beyond the initial 500 story ids, the HN api doesn't document any way of fetching only stories
    // So past that point we fetch 100 items at a time, and only display the ones which are stories
    const amountToFetch =
      state.newest.data.length > 500
        ? amountToFetchWhenCommentsToo
        : amountToFetchWhenStoriesOnly;

    const firstUnfetchedIndex = state.newest.data.findIndex(
      (id) => !state.stories[id]
    );

    if (firstUnfetchedIndex > -1) {
      api.fetchStories(
        state.newest.data.slice(
          firstUnfetchedIndex,
          firstUnfetchedIndex + amountToFetch
        ),
        {
          before: actions.loadingItem,
          after: actions.loadingItemSuccess,
        }
      );
    }

    if (firstUnfetchedIndex + amountToFetch >= state.newest.data.length) {
      actions.growList(amountToFetchWhenCommentsToo);
    }
  };

  return { state, loadNextStories } as const;
};
