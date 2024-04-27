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
  return <div key={"k-" + props.company.id} className="company" role="listitem" >
    <p> {props.company.name}</p>
    {
      props.company.regions?.map(region => (
        <p> {region}</p>
      ))
    }
    <p>{props.company.oneLiner}</p>
    <img src={props.company.smallLogoUrl} />
    {/* <p>{props.company.name}</p> */}
  </div >
  //  <pre>{JSON.stringify(props.company, null, 2)}</pre>

  //  <pre>{JSON.stringify(props.user, null, 2)}</pre>
  // return <div key={props.user.login.uuid}>
  //   <img src={props.user.picture.thumbnail} />
  //   <p>   {`${ props.user.name.title } ${ props.user.name.first } ${ props.user.name.last } `}
  //   </p>
  //   <p>{props.user.email}</p></div>

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

  return <div className="companies" role="list">{data.companies.map(company => ((
    <Company key={company.id} company={company} />
  )))}
    <p>Current page {props.currentPage} / {data.totalPages} </p>
    <button disabled={(props.currentPage <= 1)} onClick={() => props.setCurrentPage((old) => old - 1)}>Previous</button>
    <button disabled={(props.currentPage > data.totalPages)} onClick={() => props.setCurrentPage((old) => old + 1)}>Next</button></div>;
  // (
  // <div>
  //   {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
  //   {data.companies.map(user => (
  //     <div>
  //       <User user={user} />
  //     </div>
  //   ))}
  //   <div>{isFetching ? 'Updating...' : ''}</div>
  //   <p>Current page: {props.currentPage}</p>

  //   <button disabled={(props.currentPage <= 1)} onClick={() => {
  //     props.setCurrentPage(old => old - 1)
  //   }}>Previous</button>
  //   <button onClick={() => {
  //     props.setCurrentPage(old => old + 1)
  //   }}>Next</button>
  //   <ReactQueryDevtools initialIsOpen />
  // </div >
  // )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParam, setQueryParam] = useState("");

  return (
    <><h1 className="title"> Startup Directory </h1>
      <input onChange={e => { setQueryParam(e.target.value) }} name="search" type="text" placeholder="Search..."></input >
      <QueryClientProvider client={queryClient}>
        <Users currentPage={currentPage} pageSize={PAGE_SIZE} setCurrentPage={setCurrentPage} queryParam={queryParam} />
      </QueryClientProvider></>
  )
}
