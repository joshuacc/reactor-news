import { reducer, defaultState, State } from './reducer';
import { Story } from './api';

const stateWithNewest: State = {
  loading: false,
  newest: { status: 'SUCCESS', data: [1, 2] },
  stories: {},
};

describe('HN story reducer', () => {
  it('should handle LOADING_LIST correctly', () => {
    const newState = reducer(defaultState, { type: 'LOADING_LIST' });

    expect(newState).toMatchObject({
      loading: true,
      newest: { status: 'LOADING' },
    });
  });

  it('should handle LOADING_LIST_SUCCESS correctly', () => {
    const newState = reducer(defaultState, {
      type: 'LOADING_LIST_SUCCESS',
      list: [1, 2],
    });

    expect(newState).toMatchObject({
      loading: false,
      newest: { status: 'SUCCESS', data: [1, 2] },
    });
  });

  it('should handle LOADING_LIST_ERROR correctly', () => {
    const newState = reducer(defaultState, {
      type: 'LOADING_LIST_ERROR',
      error: new Error(),
    });

    expect(newState).toMatchObject({
      loading: false,
      newest: { status: 'ERROR', error: new Error() },
    });
  });

  it('should handle LOADING_ITEM correctly', () => {
    const newState = reducer(stateWithNewest, {
      type: 'LOADING_ITEM',
      id: 1,
    });

    expect(newState).toMatchObject({
      loading: true,
      stories: { 1: { status: 'LOADING' } },
    });
  });

  it('should handle LOADING_ITEM_SUCCESS correctly', () => {
    const newState = reducer(
      {
        ...stateWithNewest,
        loading: true,
        stories: { 1: { status: 'LOADING' } },
      },
      {
        type: 'LOADING_ITEM_SUCCESS',
        story: {
          id: 1,
        } as Story,
      }
    );

    expect(newState).toMatchObject({
      loading: false,
      stories: { 1: { status: 'SUCCESS', data: { id: 1 } } },
    });
  });
});
