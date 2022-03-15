import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCallback } from 'react';
import './App.css';
import Details from './components/Details';
import Header from './components/Header';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import { CartTypes, useCartReducer } from './reducers/cartReducer';
import { items } from './items';

function App() {
  const [cart, dispatchCart] = useCartReducer();
  const addToCart = useCallback(
    (itemId) => dispatchCart({ type: CartTypes.ADD, itemId }),
    [dispatchCart],
  );

  return (
    <Router>
      <Header cart={cart} />
      <Routes>
        <Route
          path="/details/:id"
          element={<Details addToCart={addToCart} items={items} />}
        />
        <Route path="/" element={<Home items={items} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
