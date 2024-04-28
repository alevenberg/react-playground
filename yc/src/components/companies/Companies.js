
import {
    useQuery,
} from '@tanstack/react-query'
import axios from 'axios'
import React, { useState, useRef } from 'react'
import './Companies.css';
import { v4 as uuidv4 } from 'uuid';
import { Company } from "../company/Company.js"

const API_ENDPOINT = "https://api.ycombinator.com/v0.1/companies"

export function Companies({ pageParam, queryParam, setPageParam }) {
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
                        const merge = (a, b, predicate = (a, b) => a === b) => {
                            const c = [...a]; // copy to avoid side effects
                            // add all items from B to copy C if they're not already present
                            b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
                            return c;
                        }
                        const newCompanies = merge(companies, res.data.companies, (a, b) => a.id === b.id);

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
        refetchOnWindowFocus: false,
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
        const total_companies = (isSinglePageResult) ? firstPageLength.current : Math.max((firstPageLength.current * (totalPages.current - 1)) + lastPageLength.current, total_companies_on_page);
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