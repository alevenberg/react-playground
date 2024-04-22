import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

// https://www.greatfrontend.com/questions/user-interface/job-board/solution
// 1. Display a list of ids
// https://hacker-news.firebaseio.com/v0/jobstories.json
// 2.  https://hacker-news.firebaseio.com/v0/item/35908337.json:
function App() {
  const [jobIds, SetJobIds] = useState()

  async function fetchJobIds() {
    try {
      const response = await axios.get(`https://hacker-news.firebaseio.com/v0/jobstories.json`);
      const results = response.data;
      return results;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchJobIds().then(data => {
      console.log(data);
      SetJobIds(data);
    })
  }, [])

  return (
    <div className="App">
      <h1> Hacker News Jobs Board</h1>
      <div>
        {JSON.stringify(jobIds)}
      </div>
    </div>
  );
}

export default App;
