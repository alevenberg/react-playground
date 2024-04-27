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
// How many to present via load more.
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
  const queryParam = props.queryParam;
  // The /companies endpoint starts from page 0 when you use a q parameter and returns page size 20, 
  // but page size 25 1 when you only use the page parameter
  var pageParam = (queryParam == "") ? currentPage : currentPage - 1;

  const { isPending, error } = useQuery({
    queryKey: [pageParam, queryParam],
    queryFn: () =>
      axios
        .get(`${API_ENDPOINT}?page=${pageParam}&q=${queryParam}`)
        .then((res) => {
          // console.log(res.data);
          // console.log(queryParam)
          // console.log("page" + pageParam)
          if ((pageParam == 0 && queryParam != "") || (pageParam == 1 && queryParam == "")) {
            // Clear the existiting data
            // console.log("clear")
            setCompanies(res.data.companies);
          } else {
            const newCompanies = [...companies, ...res.data.companies];
            setCompanies(newCompanies);
          }
          console.log(companies.length)
          setTotalPages(res.data.totalPages);
          console.log(res.data)
          console.log("next" + res.data.nextPage);

          if (res.data.nextPage === undefined) {
            console.log("setIsEndOfResults" + props.setIsEndOfResults);
            props.setIsEndOfResults(true);
          }
          // props.setCurrentPage((old) => {
          //   if (old < res.data.totalPages && companies.length <= currentPage * PAGE_SIZE) { return old + 1 }
          // });
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
    const total_companies_on_page = Math.min(total_companies, companies.length);
    console.log("total_companies".concat(total_companies));
    let total_companies_text = `Showing ${total_companies_on_page} of `;
    if (total_companies === 1) {
      total_companies_text += "1 company";
    } else {
      if (total_companies > 1000) {
        total_companies_text += "1000+";
      } else {
        total_companies_text += total_companies;
      }
      total_companies_text += " companies";
    }
    return total_companies_text;
  }

  function loadMore(e) {
    e.preventDefault();
    props.setCurrentPage((old) => old + 1);
  }
  // Todo, no matches
  // Todo remove button at thend
  return <div>

    {/* <div className='status'>Sorry, no matching companies found</div> */}
    <div className='message'>{getMessage()}</div>
    <div className="companies" role="list">{companies.map((company, idx) => ((
      <Company key={uuidv4()} company={company} />
    )))}

    </div>
    {(isPending) && <div className='loading'>Loading... </div>}

    {(!props.isEndOfResults) &&
      <button onClick={loadMore}>Load more...</button>}

  </div >;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParam, setQueryParam] = useState("");
  const [isEndOfResults, setIsEndOfResults] = useState(false);

  return (
    <div className='app'>
      <h1 className="title"> Startup Directory </h1>
      <div className="search-box">
        <input onChange={e => {
          setQueryParam(e.target.value); setCurrentPage(1); setIsEndOfResults(false);
        }} name="search" type="text" placeholder="Search..."></input >
      </div>
      <QueryClientProvider client={queryClient}>
        <Companies currentPage={currentPage} pageSize={PAGE_SIZE} isEndOfResults={isEndOfResults} setIsEndOfResults={setIsEndOfResults} setCurrentPage={setCurrentPage} queryParam={queryParam} />
      </QueryClientProvider>
    </div >
  )
}
