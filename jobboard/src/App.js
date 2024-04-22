import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

// https://www.greatfrontend.com/questions/user-interface/job-board/solution
// 1. Display a list of ids
// https://hacker-news.firebaseio.com/v0/jobstories.json
// 2.  https://hacker-news.firebaseio.com/v0/item/35908337.json:
function App() {
  const [jobIds, SetJobIds] = useState([])
  const [jobs, SetJobs] = useState([])
  const [index, SetIndex] = useState(6)

  async function fetchJob(jobId) {
    try {
      const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${jobId}.json`);
      const results = response.data;
      return results;
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchJobIds() {
    try {
      const response = await axios.get(`https://hacker-news.firebaseio.com/v0/jobstories.json`);
      const results = response.data;
      return results;
    } catch (error) {
      console.error(error);
    }
  }

  function handleLoadMore(e) {
    e.preventDefault();
    var newIndex = index + 6;
    if (newIndex >= jobIds.length) {
      newIndex = jobIds.length;
    }
    SetIndex(newIndex);
    console.log(newIndex);
  }

  useEffect(() => {
    fetchJobIds().then(data => {
      console.log(data);
      SetJobIds(data);
    })
    for (let i = 0; i < jobIds.length; i++) {
      fetchJob(jobIds[i]).then(data => {
        console.log(data);
        const newJobs = [...jobs, data]
        SetJobs(newJobs);
      })
    }
  }, [])

  return (
    <div className="App">
      <h1> Hacker News Jobs Board</h1>
      <div>
        {JSON.stringify(jobIds)}
      </div>
      <div>
        {JSON.stringify(jobs)}
      </div>
      <button onClick={handleLoadMore}>Load more jobs</button>
    </div>
  );
}

export default App;
