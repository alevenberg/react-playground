import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'

const queryClient = new QueryClient()
const API_ENDPOINT = "https://randomuser.me/api/"
const PAGE_SIZE = 10

function User(props) {
  return <div key={props.user["login"]["uuid"]}>
    <img src={props.user.picture.thumbnail} />
    <p>   {`${props.user.name.title} ${props.user.name.first} ${props.user.name.last}`}
    </p>
    <p>{props.user.email}</p></div>

}

// https://randomuser.me/documentation#pagination
function Users(props) {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [`pagedData-${props.currentPage}`],
    queryFn: () =>
      axios
        .get(`${API_ENDPOINT}?page=${props.currentPage}&results=${props.pageSize}&seed=abc`)
        .then((res) => res.data),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data.results.map(user => (
        <div >
          <User user={user} />
        </div>
      ))}
      <div>{isFetching ? 'Updating...' : ''}</div>
      <p>Current page: {props.currentPage}</p>

      <button disabled={(props.currentPage <= 1)} onClick={() => {
        props.setCurrentPage(old => old - 1)
      }}>Previous</button>
      <button onClick={() => {
        props.setCurrentPage(old => old + 1)
      }}>Next</button>
      <ReactQueryDevtools initialIsOpen />
    </div >
  )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <QueryClientProvider client={queryClient}>
      <Users currentPage={currentPage} pageSize={PAGE_SIZE} setCurrentPage={setCurrentPage} />
    </QueryClientProvider>
  )
}
