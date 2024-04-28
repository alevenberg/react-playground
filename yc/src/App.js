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

function Companies({ pageParam, queryParam, setPageParam, isNewQuery, setIsNewQuery }) {
  const [companies, setCompanies] = useState([]);
  // const [totalPages, setTotalPages] = useState(0);

  var hasQueryParam = queryParam.length > 0;
  // var currentPage = hasQueryParam ? pageParam + 1 : pageParam;
  var currentPage = hasQueryParam ? pageParam + 1 : pageParam;
  var totalPages = useRef(-1);
  var firstPageLength = useRef(0);
  var isEndOfResults = false;
  var isFirstQuery = false;

  const { isPending, errorPageQuery } = useQuery({
    queryKey: [pageParam, queryParam],
    queryFn: () =>
      axios
        .get(`${API_ENDPOINT}?page=${pageParam}&q=${queryParam}`)
        .then((res) => {
          console.log(res.data);
          // First query in the pagination.
          if (currentPage === 1) {
            isFirstQuery = true;
            setCompanies(res.data.companies);
            firstPageLength.current = res.data.companies.length;
            totalPages.current = res.data.totalPages;
            isEndOfResults = false;
          } else {
            const newCompanies = [...companies, ...res.data.companies];
            setCompanies(newCompanies);
          }
          if (res.data.nextPage === undefined) {
            isEndOfResults = true;
            console.log("setIsEndOfResults" + isEndOfResults);
          }
          return res.data;
        }
        ),
  })

  var lastPage = totalPages - 1;
  var lastPageLength = 0;
  // A best effort query for the last page to get the total results.
  useQuery({
    queryKey: [lastPage, queryParam],
    enabled: isFirstQuery && !isEndOfResults,
    queryFn: () =>
      axios
        .get(`${API_ENDPOINT}?page=${lastPage}&q=${queryParam}`)
        .then((res) => {
          lastPageLength = res.data.companies.length;
        }
        ),
  })

  function getMessage() {
    //   companies = companies.length
    //   total = firstQueryLength * totalPages -1 + lastQuerylength
    //   let total_companies = totalPages * PAGE_SIZE;
    //   const total_companies_on_page = Math.min(total_companies, companies.length);
    //   if (props.isEndOfResults) {
    //     total_companies = companies.length;
    //   }
    //   console.log("total_companies".concat(total_companies));
    //   let total_companies_text = `Showing ${total_companies_on_page} of `;
    //   if (total_companies === 1) {
    //     total_companies_text += "1 company";
    //   } else {
    //     if (total_companies > 1000) {
    //       total_companies_text += "1000+";
    //     } else {
    //       total_companies_text += total_companies;
    //     }
    //     total_companies_text += " companies";
    //   }
    //   return total_companies_text;
  }

  function loadMore(e) {
    e.preventDefault();
    setPageParam((old) => old + 1);
  }

  // // Todo remove button at then
  if (errorPageQuery) return 'An error has occurred: ' + errorPageQuery.message
  if (totalPages.current === 0) return <div className='status'>Sorry, no matching companies found</div>

  return <div>
    {(isPending && isFirstQuery) ? <div className='loading'>Loading... </div> :
      <>
        <div className='message'>{getMessage()}</div>
        <div className="companies" role="list">{companies.map((company, idx) => ((
          <Company key={uuidv4()} company={company} />
        )))}
        </div>
        {(isPending) && <div className='loading'>Loading... </div>}
      </>
    }

    {(!isEndOfResults) &&
      <button onClick={loadMore}>Load more...</button>}

  </div >;
}

export default function App() {
  const [pageParam, setPageParam] = useState(1);
  const [queryParam, setQueryParam] = useState("");
  const [isNewQuery, setIsNewQuery] = useState(false);

  return (
    <div className='app'>
      <h1 className="title"> Startup Directory </h1>
      <div className="search-box">
        <input onChange={e => {
          setQueryParam(e.target.value);
          // When querying the /companies endpoint with a q parameter, the pages start from 0.
          setPageParam(0);
          setIsNewQuery(true);
        }} name="search" type="text" placeholder="Search..."></input >
      </div>
      <QueryClientProvider client={queryClient}>
        <Companies pageParam={pageParam} queryParam={queryParam} setPageParam={setPageParam}
          isNewQuery={isNewQuery} setIsNewQuery={setIsNewQuery}
        />
      </QueryClientProvider>
    </div >
  )
}
