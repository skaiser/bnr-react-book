import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Details from './components/Details';
import Header from './components/Header';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import { items } from './items';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/details/:id" element={<Details items={items} />} />
        <Route path="/" element={<Home items={items} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
