import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

// https://www.youtube.com/watch?v=A0BmLYHLPZs
function App() {
  const [points, setPoints] = useState([]);
  const [undoPoints, setUndoPoints] = useState([]);

  function handlePlaceCircle(e) {
    const { clientX, clientY } = e;
    setPoints([...points, {
      x: clientX,
      y: clientY
    }])
  }

  function handleUndo() {
    var newPoints = [...points];
    var oldPoint = newPoints.pop();
    setUndoPoints([
      ...undoPoints,
      oldPoint
    ]);
    setPoints(newPoints);
  }

  function handleRedo() {
    var undoPointsArr = [...undoPoints];
    var oldPoint = undoPointsArr.pop();
    setUndoPoints(undoPointsArr);
    setPoints([
      ...points,
      oldPoint
    ])
  }

  return (<>
    <button onClick={handleUndo}>Undo </button>
    <button onClick={handleRedo}>Redo </button>
    <div className="App" onClick={handlePlaceCircle}>
      <h1> Circle</h1>
      {points.map(point => (<div className="Point" style={{
        left: point.x + "px",
        top: point.y + "px"
      }}></div>))
      }
    </div ></>
  );
}

export default App;
