import './App.css';
import Apple from './items/apple.svg';
import Coffee from './items/coffee.svg';
import Cookie from './items/cookie.svg';
import Tea from './items/tea.svg';
import Wine from './items/wine.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Coffee Shop</h1>
      </header>
      <div>
        <a href="#todo">
          <img src={Apple} alt="Apple" />
          <div>Apple</div>
        </a>
        <a href="#todo">
          <img src={Coffee} alt="Coffee" />
          <div>Coffee</div>
        </a>
        <a href="#todo">
          <img src={Cookie} alt="Cookie" />
          <div>Cookie</div>
        </a>
        <a href="#todo">
          <img src={Tea} alt="Tea" />
          <div>Tea</div>
        </a>
        <a href="#todo">
          <img src={Wine} alt="Wine" />
          <div>Wine</div>
        </a>
      </div>
    </div>
  );
}

export default App;
