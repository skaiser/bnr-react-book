import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { createMemoryHistory } from 'history';
import { MemoryRouter as Router } from 'react-router-dom';
import server from '../mocks/server';
import Login from './Login';

// eslint-disable-next-line arrow-body-style
const createWrapper = (history) => {
  // eslint-disable-next-line react/prop-types
  return function ({ children }) {
    return (
      <div id="root">
        <Router history={history} initialEntries={['/login']}>
          {children}
        </Router>
      </div>
    );
  };
};

describe('Login', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('Shows error when login fails', async () => {
    server.use(
      // eslint-disable-next-line arrow-body-style
      rest.post('/api/auth/login', async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Login error' }));
      }),
    );
    const history = createMemoryHistory();
    render(<Login />, { wrapper: createWrapper(history) });

    userEvent.type(screen.getByLabelText(/Username/), 'Big Nerd Ranch');
    userEvent.type(screen.getByLabelText(/Password/), 'l337');
    userEvent.click(screen.getByRole('button'), { name: /Login/ });

    expect(await screen.findByText(/There was an error/)).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('Navigates to "/" when login succeeds', async () => {
    const history = createMemoryHistory();
    render(<Login />, { wrapper: createWrapper(history) });

    userEvent.type(screen.getByLabelText(/Username/), 'Big Nerd Ranch');
    userEvent.type(screen.getByLabelText(/Password/), 'l337');
    const loginBtn = screen.getByRole('button', { name: /Login/ });
    expect(loginBtn).toBeEnabled();
    userEvent.click(loginBtn);

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(history.location.pathname).toBe('/');
  });
});
