import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ITEMS_PER_PAGE = 6;
const API_ENDPOINT = "https://hacker-news.firebaseio.com/v0/"

async function fetchJobIds() {
  try {
    const response = await axios.get(`${API_ENDPOINT}/jobstories.json`);
    const results = response.data;
    return results;
  } catch (error) {
    console.error(error);
  }
}

async function fetchJob(jobId) {
  try {
    const response = await axios.get(`${API_ENDPOINT}/item/${jobId}.json`);
    const results = response.data;
    return results;
  } catch (error) {
    console.error(error);
  }
}

function Loading(props) {
  const isLoading = props.jobs.length < 1;
  if (isLoading) {
    return <p className='loading'>Loading...</p>;
  } else {
    return <><div> props.jobs</div>
      <div><pre>{JSON.stringify(props.jobs, null, 2)}</pre></div>;
    </>
  }

}

// 1. Set up constants (page size and api endpoint)
// 2. Store the jobIds in state and display in a div
// 3. Create a Loading component to show a loading when there are 0 items in the array, and the array otherwise
// 4. Add a button to load more jobs
// 6.
// https://www.greatfrontend.com/questions/user-interface/job-board/solution
// 1. Display a list of ids
// https://hacker-news.firebaseio.com/v0/jobstories.json
// 2.  https://hacker-news.firebaseio.com/v0/item/35908337.json:
function App() {
  const [jobIds, SetJobIds] = useState([])
  const [jobs, SetJobs] = useState([])
  const [index, SetIndex] = useState(6)
  const [page, SetPage] = useState(0)

  useEffect(() => {
    fetchJobs(page);
    fetchJobIds().then(data => {
      // console.log(data);
      SetJobIds(data);
    })
    // fetchJobs().then(data => {
    //   console.log(data);
    //   SetJobs(data);
    // })
    // var newJobs = []
    // for (let i = 0; i < jobIds.length; i++) {
    //   fetchJob(jobIds[i]).then(data => {
    //     // console.log(data);
    //     newJobs = [...jobs, data]
    //     console.log(newJobs);

    //   })
    // }
    // console.log(newJobs);
    // SetJobs(newJobs);
  }, [])

  function handleLoadMore(e) {
    e.preventDefault();
    var newIndex = index + 6;
    if (newIndex >= jobIds.length) {
      newIndex = jobIds.length;
    }
    SetIndex(newIndex);
    console.log(newIndex);
  }

  return (
    <div className="App">
      <h1> Hacker News Jobs Board</h1>
      <h2> Job Ids</h2>
      <div>
        {JSON.stringify(jobIds)}
      </div>
      <h2> Jobs</h2>
      <Loading jobs={jobs}></Loading>
      {/* <div>
        {JSON.stringify(jobs)}
      </div> */}
      <button onClick={handleLoadMore}>Load more jobs</button>
    </div>
  );
}

export default App;
