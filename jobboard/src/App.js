/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import { useEffect, useState } from 'react';
import './App.css';

const queryClient = new QueryClient();
const PAGE_SIZE = 6;
const API_ENDPOINT = "https://hacker-news.firebaseio.com/v0";

function Example(props) {
  // console.log(props);
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [props.id],
    queryFn: () =>
      axios
        .get(props.endpoint)
        .then((res) => res.data),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{props.id}</h1>
      <div><pre>{JSON.stringify(data, null, 2)}</pre></div>
      <div>{isFetching ? 'Updating...' : ''}</div>
      <ReactQueryDevtools initialIsOpen />
    </div>
  )
}

function getSlice(data, page) {
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return data.slice(start, end);
}

function JobPosting(props) {
  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData } = useQuery({
      // Must specify key to avoid caching.
      queryKey: [`Job-${props.job_id}`],
      queryFn: () =>
        axios
          .get(`${API_ENDPOINT}/item/${props.job_id}.json`)
          .then((res) => res.data),
    })

  // return <p key={props.job_id}>{props.job_id}</p>

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="post" role='listitem'>
          <h2 className="post__title">
            {data?.url ? (<a className="post__title__link" href={data.url} target="_blank" rel="noopener">{data?.title}</a>) : (data?.title)}
          </h2>
          <p> By {data?.by} &middot; {' '}
            {new Date(data.time * 1000).toLocaleString()}</p>
        </div>
      )}
      {isFetching ? <span> Loading...</span> : null} {' '}
    </div >
  )
}

function JobIds(props) {
  // console.log(props);
  const [page, setPage] = React.useState(0)

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData } = useQuery({
      queryKey: ["JobIds"],
      queryFn: () =>
        axios
          .get(`${API_ENDPOINT}/jobstories.json`)
          .then((res) => res.data),
      keepPreviousData: true
    })

  return (
    <div>
      <h1 className='title'>{"Hacker News Jobs Board"}</h1>

      {isLoading ? (
        <div className='loading'>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="jobs" role="list">
          {/* <div><pre>{JSON.stringify(data, null, 2)}</pre></div> */}
          {
            getSlice(data, page).map(job_id => (
              <div>
                <JobPosting job_id={job_id} />
              </div>
            ))
          }
        </div>
      )}
      <span className="page-info">Current Page: {page + 1} / {data?.length / PAGE_SIZE}</span>
      <button
        className='previous-button'

        onClick={() => setPage(old => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page

      </button>{' '}
      <button
        className='next-button'
        onClick={() => {
          if (data && data.length > (page + 1) * PAGE_SIZE) {
            console.log(!data.length);
            setPage(old => old + 1)
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={(data && data.length <= (page + 1) * PAGE_SIZE)}
      >
        Next Page
      </button>
      {isFetching ? <span className="loading"> Loading...</span> : null} {' '}
    </div >
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* {console.log(`${API_ENDPOINT}/jobstories.json`)} */}
      {/* <Example id="job_ids" endpoint={`${API_ENDPOINT}/jobstories.json`} /> */}
      {/* <Example id="job-40146937" endpoint={`${API_ENDPOINT}/item/40146937.json`} /> */}
      <JobIds />
    </QueryClientProvider>
  )
}

export default App;
