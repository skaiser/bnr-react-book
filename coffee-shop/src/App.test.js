import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getOrders } from './mocks/data';
import App from './App';
import { items } from './items';

describe('App', () => {
  it("Displays the Logged In User's Username", async () => {
    render(<App />);
    await screen.findByText(/Welcome, Tester/);
  });

  // Integration test
  it('Allows the user to build a cart and place an order', async () => {
    render(
      <div id="root">
        <App />
      </div>,
    );
    await waitFor(() => {
      const thumbnails = screen.queryAllByTestId('thumbnail-component');
      expect(thumbnails).toHaveLength(items.length);
    });
    userEvent.click(screen.getByRole('link', { name: /Apple/i }));
    expect(await screen.findByText(/Price:/)).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
    await waitFor(() => expect(screen.getByTestId('cart-quantity')).toHaveTextContent('1'));

    userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
    await waitFor(() => expect(screen.getByTestId('cart-quantity')).toHaveTextContent('2'));

    userEvent.click(screen.getByRole('link', { name: /Cart/i }));
    expect(await screen.findByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Place Order' })).toBeDisabled();

    userEvent.type(screen.getByLabelText(/Name/), 'Big Nerd Ranch');
    userEvent.type(screen.getByLabelText(/Zip Code/), '30307');
    expect(screen.getByRole('button', { name: 'Place Order' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: /Place Order/i }));
    expect(await screen.findByText(/Thanks for your order/i)).toBeInTheDocument();
    expect(getOrders()).toHaveLength(1);

    userEvent.click(screen.getByRole('button', { name: /Return Home/i }));
    expect(await screen.findAllByTestId('thumbnail-component')).toHaveLength(items.length);
  });
});
