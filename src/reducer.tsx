import { Story } from './api';
import { Dispatch } from 'react';

interface LoadingState {
  status: 'LOADING';
}

interface SuccessState<T> {
  status: 'SUCCESS';
  data: T;
}

interface ErrorState {
  status: 'ERROR';
  error: Error;
}

type Loadable<T> = LoadingState | SuccessState<T> | ErrorState;

// This enables exhaustive type-checking for switch statements.
// When thrown in the default case, if any other possible cases aren't handled,
// TypeScript will point it out with a compilation error.
class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
}

interface LoadingList {
  type: 'LOADING_LIST';
}

interface LoadingListSuccess {
  type: 'LOADING_LIST_SUCCESS';
  list: number[];
}

interface LoadingListError {
  type: 'LOADING_LIST_ERROR';
  error: Error;
}

type ListActions = LoadingList | LoadingListSuccess | LoadingListError;

interface LoadingItem {
  type: 'LOADING_ITEM';
  id: number;
}

interface LoadingItemSuccess {
  type: 'LOADING_ITEM_SUCCESS';
  story: Story;
}

interface LoadingItemError {
  type: 'LOADING_ITEM_ERROR';
  id: number;
  error: Error;
}

type ItemActions = LoadingItem | LoadingItemSuccess | LoadingItemError;

export type Actions = ListActions | ItemActions;

export type StoryState = Loadable<Story> | undefined;
export interface State {
  loading: boolean;
  newest: Loadable<number[]>;
  stories: Record<number, StoryState>;
}

export const defaultState: State = {
  loading: true,
  newest: {
    status: 'LOADING',
  },
  stories: {},
};

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'LOADING_LIST':
      return { ...state, loading: true, newest: { status: 'LOADING' } };
    case 'LOADING_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        newest: { status: 'SUCCESS', data: action.list },
      };
    case 'LOADING_LIST_ERROR':
      return {
        ...state,
        loading: false,
        newest: { status: 'ERROR', error: action.error },
      };
    case 'LOADING_ITEM':
      return {
        ...state,
        loading: true,
        stories: { ...state.stories, [action.id]: { status: 'LOADING' } },
      };
    case 'LOADING_ITEM_SUCCESS': {
      return {
        ...state,

        stories: {
          ...state.stories,
          [action.story.id]: { status: 'SUCCESS', data: action.story },
        },
        loading:
          state.newest.status === 'LOADING' ||
          (state.newest.status === 'SUCCESS' &&
            state.newest.data.some(
              (id) =>
                id !== action.story.id &&
                state.stories[id]?.status === 'LOADING'
            )),
      };
    }
    case 'LOADING_ITEM_ERROR':
      return {
        ...state,
        loading:
          state.newest.status === 'LOADING' ||
          (state.newest.status === 'SUCCESS' &&
            state.newest.data.some(
              (id) =>
                id !== action.id && state.stories[id]?.status === 'LOADING'
            )),
        stories: {
          ...state.stories,
          [action.id]: { status: 'ERROR', error: action.error },
        },
      };
    default:
      throw new UnreachableCaseError(action);
  }
};

export const getActionDispatchers = (dispatch: Dispatch<Actions>) => ({
  loadingList: () => dispatch({ type: 'LOADING_LIST' }),
  loadingListSuccess: (list: number[]) =>
    dispatch({
      type: 'LOADING_LIST_SUCCESS',
      list,
    }),
  loadingListError: (error: Error) =>
    dispatch({
      type: 'LOADING_LIST_ERROR',
      error,
    }),
  loadingItem: (id: number) => dispatch({ type: 'LOADING_ITEM', id }),
  loadingItemSuccess: (story: Story) =>
    dispatch({
      type: 'LOADING_ITEM_SUCCESS',
      story,
    }),
  loadingItemError: (id: number, error: Error) =>
    dispatch({
      type: 'LOADING_ITEM_ERROR',
      id,
      error,
    }),
});
