import axios from 'axios';
// eslint-disable-next-line object-curly-newline
import { useState, useRef, useMemo, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { CartTypes } from '../reducers/cartReducer';
import customModalStyles from '../styles/modalCustomStyles';
import './Cart.css';

function Select({ options, onChange, initialValue = 0 }) {
  const [value, setValue] = useState(initialValue);

  /*
   * Update the element value if initialValue was changed outside of
   * this component (e.g., from CartTypes.ADD or CartTypes.DECREASE events).
   */
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <select value={value} onChange={handleChange}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

Select.propTypes = {
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
};

function Cart({ cart, items, dispatch }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [apiError, setApiError] = useState('');
  const zipRef = useRef();
  const navigate = useNavigate();

  // Set here to allow tests to pass due to async app rendering.
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const subTotal = cart.reduce((acc, item) => {
    const details = items.find((i) => i.id === item.id);
    return item.quantity * details.price + acc;
  }, 0);

  const taxRate = useMemo(() => {
    const taxPercentage = parseInt(zipCode.substring(0, 1) || '0', 10) + 1;
    return taxPercentage / 100;
  }, [zipCode]);
  const tax = subTotal * taxRate;
  const total = subTotal + tax;
  const formValid = zipCode.length === 5 && name.trim();

  const updatePhoneNumber = (newNumber) => {
    const digits = newNumber.replace(/\D/g, '');
    let formatted = digits.substring(0, 3);
    if (digits.length === 3 && newNumber[3] === '-') {
      formatted = `${formatted}-`;
    } else if (digits.length > 3) {
      formatted = `${formatted}-${digits.substring(3, 6)}`;
    }
    if (digits.length === 6 && newNumber[7] === '-') {
      formatted = `${formatted}-`;
    } else if (digits.length > 6) {
      formatted = `${formatted}-${digits.substring(6, 10)}`;
    }
    setPhone(formatted);

    // Probably not a good thing to do for a11y.
    if (digits.length === 10) {
      zipRef.current.focus();
    }
  };

  const submitOrder = (event) => {
    event.preventDefault();
    axios
      .post('/api/orders', {
        items: cart,
        name,
        phone,
        zipCode,
      })
      .then(() => {
        dispatch({ type: CartTypes.EMPTY });
        setThankYouOpen(true);
      })
      .catch((error) => {
        console.error(error);
        setApiError(error?.response?.data?.error || 'Unknown Error');
      });
  };

  const closeThankYouModal = () => {
    setThankYouOpen(false);
    navigate('/');
  };

  const closeApiErrorModal = () => {
    setApiError('');
  };

  return (
    <div className="cart-component">
      <Modal
        isOpen={thankYouOpen}
        onRequestClose={closeThankYouModal}
        style={customModalStyles}
        contentLabel="Thanks for your order"
      >
        <p>Thanks for your order!</p>
        <button onClick={closeThankYouModal} type="button">
          Return home
        </button>
      </Modal>
      <Modal
        isOpen={!!apiError}
        onRequestClose={closeApiErrorModal}
        style={customModalStyles}
        contentLabel="There was an error"
      >
        <p>There was an error submitting your order.</p>
        <p>{apiError}</p>
        <p>Please try again.</p>
        <button onClick={closeApiErrorModal} type="button">
          Ok
        </button>
      </Modal>
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
              {cart.map((item) => {
                const availableQuantities = [...Array(17).keys()];
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="quantity">
                        <button
                          type="button"
                          disabled={item.quantity <= availableQuantities[0]}
                          onClick={() => {
                            dispatch({
                              type: CartTypes.DECREASE,
                              itemId: item.id,
                            });
                          }}
                        >
                          -
                        </button>
                        <Select
                          initialValue={item.quantity}
                          options={availableQuantities}
                          onChange={(quantity) => {
                            dispatch({ type: CartTypes.SET_QUANTITY, itemId: item.id, quantity });
                          }}
                        />
                        <button
                          type="button"
                          // eslint-disable-next-line max-len
                          disabled={item.quantity >= availableQuantities[availableQuantities.length - 1]}
                          onClick={() => {
                            dispatch({
                              type: CartTypes.ADD,
                              itemId: item.id,
                            });
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{items.find((i) => i.id === item.id).title}</td>
                    <td>{`$${(item.quantity * items.find((i) => i.id === item.id).price).toFixed(2)}`}</td>
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
                );
              })}
            </tbody>
          </table>
          {/* eslint-disable-next-line react/jsx-one-expression-per-line  */}
          <div>Sub-total: ${subTotal.toFixed(2)}</div>
          {zipCode.length === 5 ? (
            <>
              {/* eslint-disable-next-line react/jsx-one-expression-per-line  */}
              <div>Tax: ${tax.toFixed(2)}</div>
              {/* eslint-disable-next-line react/jsx-one-expression-per-line  */}
              <div>Total: ${total.toFixed(2)}</div>
            </>
          ) : (
            <div>Enter Zip Code to get total</div>
          )}
          <h3>Checkout</h3>
          <form onSubmit={submitOrder}>
            <label htmlFor="name">
              Name:
              {/* eslint-disable jsx-a11y/no-autofocus */}
              <input
                id="name"
                autoFocus
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label htmlFor="phone">
              Phone Number:
              <input id="phone" type="tel" value={phone} onChange={(event) => updatePhoneNumber(event.target.value)} />
            </label>
            <label htmlFor="zipcode">
              Zip Code:
              <input
                id="zipcode"
                ref={zipRef}
                required
                maxLength="5"
                type="number"
                value={zipCode}
                onChange={(event) => setZipCode(event.target.value)}
              />
            </label>
            <button type="submit" disabled={!formValid}>
              Place Order
            </button>
          </form>
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
