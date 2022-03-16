import axios from 'axios';
import { useEffect, useState } from 'react';
import './Orders.css';
import PropTypes from 'prop-types';

function Orders({ items }) {
  const [orders, setOrders] = useState([]);
  // const [apiError, setApiError] = useState('');

  useEffect(() => {
    const ws = new WebSocket(
      `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}/ws-coffee`,
    );
    ws.onopen = () => {
      console.log('connected');
    };
    ws.onerror = (event) => {
      console.error(event);
    };
    ws.onmessage = (message) => {
      const newOrders = JSON.parse(message.data);
      setOrders(newOrders);
    };
    ws.onclose = () => {
      console.log('disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  const deleteOrder = (order) => {
    axios.delete(`api/orders/${order.id}`).catch(console.error);
  };

  return (
    <div className="orders-component">
      <h2>Existing Orders</h2>
      {orders.length === 0 ? (
        <div>No Orders</div>
      ) : (
        orders.map((order) => (
          <div className="order" key={order.id}>
            <p>{order.name}</p>
            {order.phone ? <p>{order.phone}</p> : null}
            <p>{order.zipCode}</p>
            <p>Items:</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  {item.quantity} - {items.find((i) => i.id === item.id).title}
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => deleteOrder(order)}>
              Delete Order
            </button>
          </div>
        ))
      )}
    </div>
  );
}

Orders.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default Orders;
