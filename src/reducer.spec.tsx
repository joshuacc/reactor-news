import { reducer, defaultState, State, getActionDispatchers } from './reducer';
import { Story } from './api';

const stateWithNewest: State = {
  loading: false,
  newest: { status: 'SUCCESS', data: [10, 9] },
  stories: {},
};

const identity = <T extends any>(arg: T) => arg;
const actions = getActionDispatchers(identity);

describe('HN story reducer', () => {
  it('should handle LOADING_LIST correctly', () => {
    const newState = reducer(defaultState, actions.loadingList());

    expect(newState).toMatchObject({
      loading: true,
      newest: { status: 'LOADING' },
    });
  });

  it('should handle LOADING_LIST_SUCCESS correctly', () => {
    const newState = reducer(defaultState, actions.loadingListSuccess([10, 9]));

    expect(newState).toMatchObject({
      loading: false,
      newest: { status: 'SUCCESS', data: [10, 9] },
    });
  });

  it('should handle LOADING_LIST_ERROR correctly', () => {
    const newState = reducer(
      defaultState,
      actions.loadingListError(new Error())
    );

    expect(newState).toMatchObject({
      loading: false,
      newest: { status: 'ERROR', error: new Error() },
    });
  });

  it('should handle GROW_LIST correctly', () => {
    const newState1 = reducer(defaultState, actions.growList(5));

    expect(newState1).toMatchObject(defaultState);

    const newState2 = reducer(stateWithNewest, actions.growList(5));

    expect(newState2).toMatchObject({
      newest: {
        status: 'SUCCESS',
        data: [10, 9, 8, 7, 6, 5, 4],
      },
    });
  });

  it('should handle LOADING_ITEM correctly', () => {
    const newState = reducer(stateWithNewest, actions.loadingItem(10));

    expect(newState).toMatchObject({
      loading: true,
      stories: { 10: { status: 'LOADING' } },
    });
  });

  it('should handle LOADING_ITEM_SUCCESS correctly', () => {
    const newState = reducer(
      {
        ...stateWithNewest,
        loading: true,
        stories: { 10: { status: 'LOADING' } },
      },
      actions.loadingItemSuccess({ id: 10 } as Story)
    );

    expect(newState).toMatchObject({
      loading: false,
      stories: { 10: { status: 'SUCCESS', data: { id: 10 } } },
    });
  });

  it('should handle LOADING_ITEM_ERROR correctly', () => {
    const newState = reducer(
      {
        ...stateWithNewest,
        loading: true,
        stories: { 10: { status: 'LOADING' } },
      },
      actions.loadingItemError(10, new Error())
    );

    expect(newState).toMatchObject({
      loading: false,
      stories: { 10: { status: 'ERROR', error: new Error() } },
    });
  });
});
