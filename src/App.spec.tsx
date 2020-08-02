import React from 'react';
import { render } from '@testing-library/react';
import { App } from './App';

window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
})) as any;

describe('App', () => {
  it('renders app title', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Reactor News/)).toBeInTheDocument();
  });
});
