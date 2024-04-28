import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Company } from "../company/Company.js";
import "./Companies.css";

const API_ENDPOINT = "https://api.ycombinator.com/v0.1/companies";

export function Companies({ pageParam, setPageParam, queryParam }) {
  const [companies, setCompanies] = useState([]);

  var hasQueryParam = queryParam.length > 0;
  var currentPage = hasQueryParam ? pageParam + 1 : pageParam;
  var totalPages = useRef(-1);
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
            isEndOfResults.current = false;
          } else {
            // If this is not the first request, add companies to the list if they are not already present.
            // From: https://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
            const merge = (a, b, predicate = (a, b) => a === b) => {
              const c = [...a]; // copy to avoid side effects
              // add all items from B to copy C if they're not already present
              b.forEach((bItem) =>
                c.some((cItem) => predicate(bItem, cItem))
                  ? null
                  : c.push(bItem)
              );
              return c;
            };
            const newCompanies = merge(
              companies,
              res.data.companies,
              (a, b) => a.id === b.id
            );

            setCompanies(newCompanies);
          }
          if (res.data.nextPage === undefined) {
            isEndOfResults.current = true;
          }
          return res.data;
        }),
  });

  function loadMore(e) {
    e.preventDefault();
    isFirstQuery.current = false;
    setPageParam((old) => old + 1);
  }

  if (errorPageQuery) return "An error has occurred: " + errorPageQuery.message;
  if (totalPages.current === 0)
    return <div className="status">Sorry, no matching companies found</div>;

  return (
    <div>
      {isPending && isFirstQuery.current ? (
        <div className="loading">Loading... </div>
      ) : (
        <>
          <div className="companies" role="list">
            {companies.map((company) => (
              <Company key={uuidv4()} company={company} />
            ))}
          </div>
          {isPending && <div className="loading">Loading... </div>}
        </>
      )}

      {!isEndOfResults.current && (
        <button onClick={loadMore}>Load more...</button>
      )}
    </div>
  );
}
