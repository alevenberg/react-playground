import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

// https://www.youtube.com/watch?v=A0BmLYHLPZs
function App() {
  const [points, setPoints] = useState([]);

  function handlePlaceCircle(e) {
    const { clientX, clientY } = e;
    setPoints([...points, {
      x: clientX,
      y: clientY
    }])
  }
  return (
    <div className="App" onClick={handlePlaceCircle}>
      <h1> Circle</h1>
      {points.map(point => (<div className="Point" style={{
        left: point.x + "px",
        top: point.y + "px"
      }}></div>))
      }
    </div >
  );
}

export default App;
