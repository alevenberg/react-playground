import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// 1. Create a simple counter
// 2. Fetch data from https://randomuser.me/api
// 3. Dump data to string
// 4. Display name and image of every user (assume we could have multiple users in array)

function App() {
  const [counter, setCounter] = useState(0);
  const [users, setUsers] = useState([]);
  const [randomUser, setRandomUser] = useState("");

  async function getUser() {
    try {
      const response = await axios.get('https://randomuser.me/api');
      const data = JSON.stringify(response.data, null, 2);
      setRandomUser(data || "No data found");
      // Assign each user a uuid for the app
      response.data.results.map((user) =>
      (user.my_app_id = uuidv4()
      ))
      setUsers(prevUsers => {
        const results = response.data.results;
        return [...prevUsers, ...results]
      })
    } catch (error) {
      console.error(error);
    }
  }

  // Not sure why this calls getUser twice on startup
  useEffect(() => {
    getUser()
  }, [])

  function handleIncrement(e) {
    setCounter(counter + 1)
  }

  function handleGetUser(e) {
    getUser()
  }

  function getUserName(user) {
    const { name: { title, first, last } } = user
    return `${title} ${first} ${last}`
  }

  return (
    <div className="App">
      <h1> Counter</h1>
      <div> {counter} </div>
      <button onClick={handleIncrement}> Increment counter </button>
      <h1> Get User</h1>
      <h2> User Info</h2>
      {
        users?.map((user) =>
        (
          <>
            <div >
              <p key={user.my_app_id}> {getUserName(user)}</p>
              <img src={user.picture.thumbnail} alt="user thumbnail" />
            </div>
          </>
        ))
      }
      <h2> User Json</h2>
      <button onClick={handleGetUser}> Get user </button>
      <pre> {randomUser} </pre>
    </div >
  );
}

export default App;
