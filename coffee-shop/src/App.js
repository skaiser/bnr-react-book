import axios from 'axios';
import Modal from 'react-modal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// eslint-disable-next-line object-curly-newline
import { useCallback, useEffect, useState, useMemo } from 'react';
import './App.css';
import Cart from './components/Cart';
import Details from './components/Details';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import PageNotFound from './components/PageNotFound';
import UserContext from './context/UserContext';
import { CartTypes, useCartReducer } from './reducers/cartReducer';
import customModalStyles from './styles/modalCustomStyles';

function App() {
  const [cart, dispatchCart] = useCartReducer();
  const [items, setItems] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [apiError, setApiError] = useState('');
  const addToCart = useCallback(
    (itemId) => {
      dispatchCart({ type: CartTypes.ADD, itemId });
    },
    [dispatchCart],
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await axios.get('/api/items');
        setItems(result.data);
      } catch (error) {
        console.error(error);
        setApiError(error?.response?.data?.error || 'Unknown Error');
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get('/api/auth/current-user');
        setUserDetails(result.data || {});
      } catch (error) {
        setApiError(error?.response?.data?.error || 'Unknown Error');
      }
    };
    fetchUser();
  }, []);

  // eslint-disable-next-line arrow-body-style
  const userContextValue = useMemo(() => {
    return { userDetails, setUserDetails };
  }, [userDetails, setUserDetails]);

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
      <UserContext.Provider value={userContextValue}>
        <Header cart={cart} />
        {items.length === 0 ? (
          <div>Loading...</div>
        ) : (
          <Routes>
            <Route path="/cart" element={<Cart cart={cart} items={items} dispatch={dispatchCart} />} />
            <Route path="/details/:id" element={<Details addToCart={addToCart} items={items} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home items={items} />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        )}
      </UserContext.Provider>
    </Router>
  );
}

export default App;
