/**
 * @jest-environment jsdom
 */

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Page from '../../pages';

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
})

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
})

it('renders with or without a name', () => {
  act(() => {
    render(<Page />, container);
  })
  expect(container.textContent).toBe('Nothing here yet.');
});