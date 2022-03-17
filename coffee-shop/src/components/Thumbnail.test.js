import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import Thumbnail from './Thumbnail';
import { itemImages } from '../items';

describe('Thumbnail', () => {
  it('Displays Thumbnail', () => {
    render(
      <Router>
        <Thumbnail id="apple" title="Apple" image={itemImages.apple} />
      </Router>,
    );
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByAltText('Apple')).toBeInTheDocument();
  });
});
