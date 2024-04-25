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
      <div><pre>{JSON.stringify(data, null, 2)}</pre></div>;
      <div>{isFetching ? 'Updating...' : ''}</div>
      <ReactQueryDevtools initialIsOpen />
    </div>
  )
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {console.log(`${API_ENDPOINT}/jobstories.json`)}
      <Example id="job_id" endpoint={`${API_ENDPOINT}/jobstories.json`} />
      <Example id="job" endpoint={`${API_ENDPOINT}/item/40146937.json`} />
    </QueryClientProvider>
  )
}

export default App;
