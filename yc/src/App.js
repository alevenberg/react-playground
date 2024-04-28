import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import axios from 'axios'
import React, { useState, useRef } from 'react'
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Company } from "./components/company/Company.js"
import { Companies } from "./components/companies/Companies.js"

const queryClient = new QueryClient()
const API_ENDPOINT = "https://api.ycombinator.com/v0.1/companies"

// TODO: handle refresh
// add a sort
// try and understand refresh data
// write test cases.


export default function App() {
  const [pageParam, setPageParam] = useState(1);
  const [queryParam, setQueryParam] = useState("");

  return (
    <div className='app'>
      <h1 className="title"> Startup Directory </h1>
      <div className="search-box">
        <input onChange={e => {
          setQueryParam(e.target.value);
          // When querying the /companies endpoint with a q parameter, the pages start from 0.
          setPageParam(0);
        }} name="search" type="text" placeholder="Search..."></input >
      </div>
      <QueryClientProvider client={queryClient}>
        <Companies pageParam={pageParam} queryParam={queryParam} setPageParam={setPageParam}

        />
      </QueryClientProvider>
    </div >
  )
}
