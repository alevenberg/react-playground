import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';

// 1. Create a simple counter
// 2. Fetch data from https://randomuser.me/api
// 3. Dump data to string
function App() {
  const [counter, setCounter] = useState(0);
  const [randomUser, setRandomUser] = useState("");

  async function getUser() {
    try {
      const response = await axios.get('https://randomuser.me/api');
      setRandomUser(JSON.stringify(response))
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  function handleIncrement(e) {
    setCounter(counter + 1)
  }

  function handleGetUser(e) {
    getUser()
  }

  return (
    <div className="App">
      <h1> Counter</h1>
      <div> {counter} </div>
      <button onClick={handleIncrement}> Increment counter </button>
      <h1> Get User</h1>
      <button onClick={handleGetUser}> Get user </button>
      <div> {randomUser} </div>
    </div>
  );
}

export default App;
