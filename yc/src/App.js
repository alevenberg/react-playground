import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const queryClient = new QueryClient()
const API_ENDPOINT = "https://api.ycombinator.com/v0.1/companies"
const PAGE_SIZE = 25

function Company(props) {
  const regions = props.company.regions?.join(" · ");
  return <div key={"k-" + props.company.id} className="company" role="listitem" >
    <a href={props.company.website}></a>
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

function Companies(props) {
  const [companies, setCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const currentPage = props.currentPage;
  const { isPending, error } = useQuery({
    queryKey: [currentPage],
    queryFn: () =>
      axios
        .get(`${API_ENDPOINT}?page=${currentPage}`)
        .then((res) => {
          // console.log(res.data.totalPages)
          const newCompanies = [...companies, ...res.data.companies];
          setCompanies(newCompanies);
          setTotalPages(res.data.totalPages);
          return res.data;
        }
        ),
  })

  if (isPending && companies.length == 0) {
    return <div className='loading'>Loading... </div>
  }

  if (error) return 'An error has occurred: ' + error.message

  function getMessage() {
    const total_companies = totalPages * PAGE_SIZE;
    let total_companies_text = "";
    if (total_companies > 1000) {
      total_companies_text += "1000+";
    } else {
      total_companies_text.concat(`${total_companies}`)
    }
    if (total_companies == 1) {
      total_companies_text += " company";
    } else {
      total_companies_text += " companies";
    }
    return total_companies_text;
  }

  function loadMore(e) {
    e.preventDefault();
    props.setCurrentPage((old) => old + 1);
  }

  return <div>

    {/* <div className='status'>Sorry, no matching companies found</div> */}
    <div className='message'>Showing {(props.currentPage * PAGE_SIZE)}  of {getMessage()}</div>
    <div className="companies" role="list">{companies.map((company, idx) => ((
      <Company key={uuidv4()} company={company} />
    )))}

    </div>
    {(isPending) && <div className='loading'>Loading... </div>}

    <button disabled={(props.currentPage > totalPages)} onClick={loadMore}>Load more...</button>
  </div >;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParam, setQueryParam] = useState("");

  return (
    <div className='app'>
      <h1 className="title"> Startup Directory </h1>
      <div className="search-box">
        <input onChange={e => { setQueryParam(e.target.value) }} name="search" type="text" placeholder="Search..."></input >
      </div>
      <QueryClientProvider client={queryClient}>
        <Companies currentPage={currentPage} pageSize={PAGE_SIZE} setCurrentPage={setCurrentPage} queryParam={queryParam} />
      </QueryClientProvider>
    </div >
  )
}
