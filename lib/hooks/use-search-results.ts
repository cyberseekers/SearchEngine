import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FetchWebsitesResult, WebsiteSortMode } from "../types/search";
import { Pageable } from "../types/pageable";

const fetchWebsites = async (
  query: string,
  sortModes: WebsiteSortMode[],
  pageNumber: number,
  pageSize: number
): Promise<Pageable<FetchWebsitesResult>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("q", query.split(" ").join("+"));
  searchParams.set("sort", sortModes.join(","));
  searchParams.set("page", pageNumber.toString());
  searchParams.set("pageSize", pageSize.toString());

  return fetch(`/api/search-results?${searchParams.toString()}`).then((res) =>
    res.json()
  );
};

/**
 * Custom hook to fetch search results based on a query string.
 *
 * This hook uses React Query's `useQuery` to fetch data from the search API.
 * It maintains the search query string in the component's state and updates
 * the search results whenever the query string changes.
 *
 * @returns {Object} An object containing:
 * - `searchQueryString` (string): The current search query string.
 * - `setSearchQueryString` (function): Function to update the search query string.
 * - `sortModes` (WebsiteSortMode[]): The current sort modes.
 * - `setSortModes` (function): Function to update the sort modes.
 * - `pageNumber` (number): The current page number.
 * - `setPageNumber` (function): Function to update the page number.
 * - `pageSize` (number): The current page size.
 * - `setPageSize` (function): Function to update the page size.
 * - All properties returned by `useQuery`, such as `data`, `error`, `isLoading`, etc.
 *
 * @example
 *
 * import { useSearchResults } from "./hooks/useSearchResults";
 *
 * const SearchComponent = () => {
 *   const {
 *     searchQueryString,
 *     setSearchQueryString,
 *     data,
 *     error,
 *     isLoading
 *   } = useSearchResults();
 *
 *   const handleInputChange = (e) => {
 *     setSearchQueryString(e.target.value);
 *   };
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={searchQueryString}
 *         onChange={handleInputChange}
 *         placeholder="Search..."
 *       />
 *       {isLoading && <p>Loading...</p>}
 *       {error && <p>Error: {error.message}</p>}
 *       {data && (
 *         <ul>
 *           {data.results.map((result) => (
 *             <li key={result.id}>{result.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * };
 */
export const useSearchResults = (
  defaultSortModes: WebsiteSortMode[],
  defaultPageNumber: number,
  defaultPageSize: number
) => {
  const [searchQueryString, setSearchQueryString] = useState("");
  const [sortModes, setSortModes] = useState(defaultSortModes);
  const [pageNumber, setPageNumber] = useState(defaultPageNumber);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const query = useQuery({
    queryKey: [
      "search-results",
      searchQueryString,
      sortModes,
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      fetchWebsites(searchQueryString, sortModes, pageNumber, pageSize),
  });

  useEffect(() => {
    setPageNumber(1);
  }, [pageSize]);

  return {
    searchQueryString,
    setSearchQueryString,
    sortModes,
    setSortModes,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    ...query,
  };
};

export const DEFAULT_SORT_MODES = Object.freeze([
  WebsiteSortMode.SORT_BY_ADS,
  WebsiteSortMode.SORT_BY_RELEVANCE,
]);

export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 10;
