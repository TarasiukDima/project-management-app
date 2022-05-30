import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Main from './Main';

// It very simple test for github actions. Later can be changed.

it('render Main', async () => {
  render(
    <Main>
      <button>test</button>
    </Main>
  );

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
});
