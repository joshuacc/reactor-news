import { Story } from './api';

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
/* istanbul ignore next */
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

interface GrowList {
  type: 'GROW_LIST';
  by: number;
}

type ListActions =
  | LoadingList
  | LoadingListSuccess
  | LoadingListError
  | GrowList;

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

const isLoading = (state: State, id: number) =>
  state.newest.status === 'LOADING' ||
  (state.newest.status === 'SUCCESS' &&
    state.newest.data.some(
      (currentId) =>
        currentId !== id && state.stories[currentId]?.status === 'LOADING'
    ));

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
    case 'GROW_LIST': {
      if (state.newest.status !== 'SUCCESS') return state;
      const list = state.newest.data;
      const lastId = list[list.length - 1];

      const newIds = [];
      for (let i = 1; i <= action.by; i++) {
        newIds.push(lastId - i);
      }

      return {
        ...state,
        newest: { ...state.newest, data: list.concat(newIds) },
      };
    }
    case 'LOADING_ITEM':
      return {
        ...state,
        loading: true,
        stories: { ...state.stories, [action.id]: { status: 'LOADING' } },
      };
    case 'LOADING_ITEM_SUCCESS': {
      return {
        ...state,
        loading: isLoading(state, action.story.id),
        stories: {
          ...state.stories,
          [action.story.id]: { status: 'SUCCESS', data: action.story },
        },
      };
    }
    case 'LOADING_ITEM_ERROR':
      return {
        ...state,
        loading: isLoading(state, action.id),
        stories: {
          ...state.stories,
          [action.id]: { status: 'ERROR', error: action.error },
        },
      };
    /* istanbul ignore next */
    default:
      throw new UnreachableCaseError(action);
  }
};

export const getActionDispatchers = (dispatch: (arg: Actions) => any) => ({
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
  growList: (by: number) => dispatch({ type: 'GROW_LIST', by }),
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
