import PropTypes from 'prop-types';
import './Cart.css';
import { CartTypes } from '../reducers/cartReducer';

function Cart({ cart, items, dispatch }) {
  const subTotal = cart.reduce((acc, item) => {
    const details = items.find((i) => i.id === item.id);
    return item.quantity * details.price + acc;
  }, 0);
  return (
    <div className="cart-component">
      <h2>Your Cart</h2>
      {cart?.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Item</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.quantity}</td>
                  <td>{items.find((i) => i.id === item.id).title}</td>
                  <td>
                    {`$${(
                      item.quantity * items.find((i) => i.id === item.id).price
                    ).toFixed(2)}`}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch({
                          type: CartTypes.REMOVE,
                          itemId: item.id,
                        });
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* eslint-disable-next-line react/jsx-one-expression-per-line  */}
          <div>Sub-total: ${subTotal.toFixed(2)}</div>
        </>
      ) : (
        <div>No items in your cart</div>
      )}
    </div>
  );
}

Cart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    }),
  ).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }),
  ).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Cart;
