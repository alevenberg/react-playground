import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';

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
      setUsers(response.data.results)
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

  function getUserName(user) {
    // console.log(user)
    const { name: { title = "Undefied", first = "Undefined", last = "Undefined" } } = user
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
            <div>
              <p>{getUserName(user)}</p>
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
