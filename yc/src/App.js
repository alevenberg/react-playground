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

const queryClient = new QueryClient()
const API_ENDPOINT = "https://api.ycombinator.com/v0.1/companies"

// TODO: handle refresh
// add a sort
// try and understand refresh data
// write test cases.

function Companies({ pageParam, queryParam, setPageParam }) {
  const [companies, setCompanies] = useState([]);

  var hasQueryParam = queryParam.length > 0;
  var currentPage = hasQueryParam ? pageParam + 1 : pageParam;
  var totalPages = useRef(-1);
  var firstPageLength = useRef(0);
  var isEndOfResults = useRef(false);
  var isFirstQuery = useRef(false);

  const { isPending, errorPageQuery } = useQuery({
    queryKey: [pageParam, queryParam],
    queryFn: () =>
      axios
        .get(`${API_ENDPOINT}?page=${pageParam}&q=${queryParam}`)
        .then((res) => {
          // First query in the pagination.
          if (currentPage === 1) {
            isFirstQuery.current = true;
            setCompanies(res.data.companies);
            firstPageLength.current = res.data.companies.length;
            totalPages.current = res.data.totalPages;
            isEndOfResults.current = false;
          } else {
            const newCompanies = [...companies, ...res.data.companies];
            setCompanies(newCompanies);
          }
          if (res.data.nextPage === undefined) {
            isEndOfResults.current = true;
          }
          return res.data;
        }
        ),
  })

  var lastPage = totalPages.current - 1;
  var lastPageLength = useRef(0);
  var isFirstQueryAndNotSinglePageResult = (isFirstQuery.current && !isEndOfResults.current);
  // A best effort query for the last page to get the total results.
  useQuery({
    queryKey: [lastPage, queryParam],
    enabled: isFirstQueryAndNotSinglePageResult,
    queryFn: () =>
      axios
        .get(`${API_ENDPOINT}?page=${lastPage}&q=${queryParam}`)
        .then((res) => {
          lastPageLength.current = res.data.companies.length;
          return lastPageLength.current;
        }
        ),
  })

  function getMessage() {
    const total_companies_on_page = companies.length;
    var isSinglePageResult = (isFirstQuery.current && isEndOfResults.current);
    const total_companies = (isSinglePageResult) ? firstPageLength.current : (firstPageLength.current * (totalPages.current - 1)) + lastPageLength.current;
    var total_companies_text = `Showing ${total_companies_on_page} of `;
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
    isFirstQuery.current = false;
    setPageParam((old) => old + 1);
  }

  if (errorPageQuery) return 'An error has occurred: ' + errorPageQuery.message
  if (totalPages.current === 0) return <div className='status'>Sorry, no matching companies found</div>

  return <div>
    {(isPending && isFirstQuery.current) ? <div className='loading'>Loading... </div> :
      <>
        <div className='message'>{getMessage()}</div>
        <div className="companies" role="list">{companies.map((company, idx) => ((
          <Company key={uuidv4()} company={company} />
        )))}
        </div>
        {(isPending) && <div className='loading'>Loading... </div>}
      </>
    }

    {(!isEndOfResults.current) &&
      <button onClick={loadMore}>Load more...</button>}

  </div >;
}

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
