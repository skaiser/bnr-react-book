import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import Home from './Home';
import { items } from '../items';

describe('Home', () => {
  it('Displays Items', () => {
    render(
      <Router>
        <Home items={items} />
      </Router>,
    );
    expect(screen.queryAllByTestId('thumbnail-component')).toHaveLength(items.length);
  });
});
