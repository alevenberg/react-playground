import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import './App.css';

const queryClient = new QueryClient()
const API_ENDPOINT = "https://api.ycombinator.com/v0.1/companies"
const PAGE_SIZE = 10

function Company(props) {
  const regions = props.company.regions?.join(" · ");
  return <div key={"k-" + props.company.id} className="company" role="listitem" >
    <div className='company-child logo'>
      <img className="company-image" src={props.company.smallLogoUrl} />
    </div>
    <div className='company-child information'>
      <div>
        <span className='company-name'> {props.company.name}</span>
        <span className='company-location'> {regions} </span>
      </div>
      <div>
        <span className='company-description'>{props.company.oneLiner}</span>
      </div>
    </div>

    {/* <pre>{JSON.stringify(props.company, null, 2)}</pre> */}
  </div >
}

// https://randomuser.me/documentation#pagination
function Users(props) {
  console.log(`${API_ENDPOINT}?page=${props.currentPage}&q=${props.queryParam}`)
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [`pagedData - ${props.currentPage} `],
    queryFn: () =>
      axios
        .get(`${API_ENDPOINT}?page=${props.currentPage}&q=${props.queryParam}`)
        .then((res) => res.data),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return <div>
    <div className="companies" role="list">{data.companies.map(company => ((
      <Company key={company.id} company={company} />
    )))}
    </div>
    <p>Current page {props.currentPage} / {data.totalPages} </p>
    <button disabled={(props.currentPage <= 1)} onClick={() => props.setCurrentPage((old) => old - 1)}>Previous</button>
    <button disabled={(props.currentPage > data.totalPages)} onClick={() => props.setCurrentPage((old) => old + 1)}>Next</button></div>;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParam, setQueryParam] = useState("");

  return (
    <div className='root'>
      <h1 className="title"> Startup Directory </h1>
      <div className='searchBox'>
        <input onChange={e => { setQueryParam(e.target.value) }} name="search" type="text" placeholder="Search..."></input >
      </div>
      <QueryClientProvider client={queryClient}>
        <Users currentPage={currentPage} pageSize={PAGE_SIZE} setCurrentPage={setCurrentPage} queryParam={queryParam} />
      </QueryClientProvider>
    </div >
  )
}
