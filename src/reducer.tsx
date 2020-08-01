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

type Actions = LoadingList | LoadingListSuccess | LoadingListError;

export interface State {
  newest: Loadable<number[]>;
  stories: Record<number, Loadable<Story>>;
}

export const defaultState: State = {
  newest: {
    status: 'LOADING',
  },
  stories: {},
};

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'LOADING_LIST':
      return { ...state, newest: { status: 'LOADING' } };
    case 'LOADING_LIST_SUCCESS':
      return { ...state, newest: { status: 'SUCCESS', data: action.list } };
    case 'LOADING_LIST_ERROR':
      return { ...state, newest: { status: 'ERROR', error: action.error } };
    default:
      throw new UnreachableCaseError(action);
  }
};
