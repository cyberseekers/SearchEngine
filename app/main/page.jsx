"use client";
import React from "react";
import SearchBar from "@/components/search-bar";
import SearchResults from "@/components/search-result";
import Tool from "@/components/tool";
import { useSearchResults } from "@/lib/hooks/use-search-results";

const Main = () => {
  const { data, isLoading, setSearchQueryString } = useSearchResults();

  const handleSearch = (query) => {
    setSearchQueryString(query);
  };

return (
    <div className="font-sans bg-gray-100 text-center p-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-black">Search Engine</h1>
      <SearchBar onSearch={handleSearch} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex justify-center mt-8">
          <div className="w-3/5">
            <SearchResults results={data} />
          </div>
          <div className="w-2/5">
            <Tool /> 
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
