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

const queryClient = new QueryClient();
const PAGE_SIZE = 6;
const API_ENDPOINT = "https://hacker-news.firebaseio.com/v0";

function Example(props) {
  console.log(props);
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

function JobIds(props) {
  console.log(props);
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
      <h1>{"JobIds"}</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          <div><pre>{JSON.stringify(data, null, 2)}</pre></div>
          {
            getSlice(data, page).map(job_id => (
              <p key={job_id}>{job_id}</p>
            ))
          }
        </div>
      )}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage(old => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page

      </button>{' '}
      <button
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
      {isFetching ? <span> Loading...</span> : null} {' '}
    </div >
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* {console.log(`${API_ENDPOINT}/jobstories.json`)} */}
      <Example id="job_ids" endpoint={`${API_ENDPOINT}/jobstories.json`} />
      <Example id="job-40146937" endpoint={`${API_ENDPOINT}/item/40146937.json`} />
      <JobIds />
    </QueryClientProvider>
  )
}

export default App;
