import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import "./App.css";
import { Companies } from "./components/companies/Companies.js";

const queryClient = new QueryClient();

export default function App() {
  const [pageParam, setPageParam] = useState(1);
  const [queryParam, setQueryParam] = useState("");

  return (
    <div className="app">
      <h1 className="title"> Startup Directory </h1>
      <div className="search-box">
        <input
          onChange={(e) => {
            setQueryParam(e.target.value);
            if (e.target.value.length > 0) {
              // When querying the /companies endpoint with a q parameter, the pages start from 0.
              setPageParam(0);
            } else {
              setPageParam(1);
            }
          }}
          name="search"
          type="text"
          placeholder="Search..."
        ></input>
      </div>
      <QueryClientProvider client={queryClient}>
        <Companies
          pageParam={pageParam}
          setPageParam={setPageParam}
          queryParam={queryParam}
        />
      </QueryClientProvider>
    </div>
  );
}
