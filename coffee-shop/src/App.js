import axios from 'axios';
import Modal from 'react-modal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Cart from './components/Cart';
import Details from './components/Details';
import Header from './components/Header';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import { CartTypes, useCartReducer } from './reducers/cartReducer';

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    color: '#000',
  },
};

function App() {
  const [cart, dispatchCart] = useCartReducer();
  const [items, setItems] = useState([]);
  const [apiError, setApiError] = useState('');
  const addToCart = useCallback(
    (itemId) => {
      dispatchCart({ type: CartTypes.ADD, itemId });
    },
    [dispatchCart],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('/api/items');
        setItems(result.data);
      } catch (error) {
        console.error(error);
        setApiError(error?.response?.data?.error || 'Unknown Error');
      }
    };
    fetchData();
  }, []);

  const closeApiErrorModal = () => {
    setApiError('');
  };

  return (
    <Router>
      <Modal
        isOpen={!!apiError}
        onRequestClose={closeApiErrorModal}
        style={customModalStyles}
        contentLabel="There was an error"
      >
        <p>There was an error fetching items.</p>
        <p>{apiError}</p>
        <p>Please reload the page.</p>
        <button onClick={closeApiErrorModal} type="button">
          Ok
        </button>
      </Modal>
      <Header cart={cart} />
      {items.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <Routes>
          <Route path="/cart" element={<Cart cart={cart} items={items} dispatch={dispatchCart} />} />
          <Route path="/details/:id" element={<Details addToCart={addToCart} items={items} />} />
          <Route path="/" element={<Home items={items} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
