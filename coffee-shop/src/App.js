import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Cart from './components/Cart';
import Details from './components/Details';
import Header from './components/Header';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import { CartTypes, useCartReducer } from './reducers/cartReducer';

function App() {
  const [cart, dispatchCart] = useCartReducer();
  const [items, setItems] = useState([]);
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
      }
    };
    fetchData();
  }, []);

  return (
    <Router>
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
