import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import "./App.css";
import { Companies } from "./components/companies/Companies.js";

const queryClient = new QueryClient();

export default function App() {
  const [pageParam, setPageParam] = useState(1);

  return (
    <div className="app">
      <h1 className="title"> Startup Directory </h1>
      <QueryClientProvider client={queryClient}>
        <Companies pageParam={pageParam} setPageParam={setPageParam} />
      </QueryClientProvider>
    </div>
  );
}
