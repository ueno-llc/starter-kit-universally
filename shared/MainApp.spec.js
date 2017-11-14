import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import App from './MainApp';

it('renders without crashing', () => {
  const tree = renderer.create(<MemoryRouter><App /></MemoryRouter>).toJSON();

  expect(tree).not.toBe(undefined);
});
