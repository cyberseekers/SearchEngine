"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/search-bar";
import SearchResults from "@/components/search-result";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_MODES,
  useSearchResults,
} from "@/lib/hooks/use-search-results";
import { SiSpinrilla } from "react-icons/si";
import { PaginationComponent } from "@/components/pagination";
import { SearchOptions } from "@/components/search-options";
import { WebsiteSortMode } from "@/lib/types/search";
import LoggedOutNav from "@/components/nav";


const Main = () => {
  const {
    data,
    error,
    isPending,
    isError,
    searchQueryString,
    isSuccess,
    setSearchQueryString,
    setPageNumber,
    setSortModes,
    pageSize,
    setPageSize,
  } = useSearchResults(
    DEFAULT_SORT_MODES,
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE
  );

  const [sortBy, setSortBy] = useState(WebsiteSortMode.SORT_BY_RELEVANCE);
  const [hideAds, setHideAds] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (hideAds) {
      setSortModes([sortBy]);
    } else {
      setSortModes([WebsiteSortMode.SORT_BY_ADS, sortBy]);
    }
  }, [sortBy, hideAds, setSortModes]);

  const handleSearch = (query) => {
    setSearchQueryString(query);
    if (!searchHistory.includes(query)) {
      setSearchHistory([...searchHistory, query]);
    }
  };

  const handleInputChange = (query) => {
    const filteredRecommendations = searchHistory.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setRecommendations(filteredRecommendations);
  };

  return (
    <div className="font-sans bg-gray-100 text-center p-12 min-h-screen">
      <LoggedOutNav />
      <h1 className="text-4xl font-bold mb-8 text-black">Search Engine</h1>
      <SearchBar
        onSearch={handleSearch}
        onInputChange={handleInputChange}
        recommendations={recommendations}
        searchHistory={searchHistory}
      />
      <SearchOptions onSortChange={setSortBy} onHideAdsChange={setHideAds} />
      <div className="flex justify-center mt-8 text-gray-500">
        {searchQueryString.trim() === "" ? (
          <span></span>
        ) : isPending ? (
          <SiSpinrilla className="animate-spin h-6 w-6" />
        ) : isError ? (
          <p className="text-red-500">
            An unexpected error occurred: {error.message}
          </p>
        ) : (
          <div className="w-3/5">
            <SearchResults results={data?.content} hideAds={hideAds} />
          </div>
        )}
      </div>
      <div className="fixed bottom-4 left-4 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <label>Show</label>
          <select
            value={pageSize}
            onChange={(event) =>
              setPageSize(Number.parseInt(event.target.value, 10))
            }
          >
            {[5, 10, 15, 20, 25].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <label>results per page.</label>
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        {isSuccess && data.content.length > 0 && (
          <p className="text-sm text-gray-500">
            Found {data.totalElements} results in{" "}
            {(data.time / 1000).toFixed(3)} seconds.
          </p>
        )}
      </div>
      {isSuccess && data.content.length > 0 && (
        <PaginationComponent
          totalPages={data.totalPages}
          hasPrevious={data.hasPrevious}
          hasNext={data.hasNext}
          currentPage={data.pageNumber}
          onPageChange={setPageNumber}
        />
      )}
    </div>
  );
};

export default Main;
