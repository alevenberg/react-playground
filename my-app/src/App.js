import React, { useState, useRef, useEffect } from 'react'

function App() {
  const [counter, setCounter] = useState([0])

  function handleIncrement(e) {
    setCounter(parseInt(counter) + 1)
  }

  return (
    <div className="App">
      <h1> Counter</h1>
      <div> {counter} </div>
      <button onClick={handleIncrement}> Increment counter </button>

    </div>
  );
}

export default App;
