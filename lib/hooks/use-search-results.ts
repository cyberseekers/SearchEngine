import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FetchWebsitesResult } from "../utils/search-query-helpers";

const fetchWebsites = async (query: string): Promise<FetchWebsitesResult> => {
  return fetch(`/api/search-results?q=${query.split(" ").join("+")}`).then(
    (res) => res.json()
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
export const useSearchResults = () => {
  const [searchQueryString, setSearchQueryString] = useState("");

  const query = useQuery({
    queryKey: ["search-results", searchQueryString],
    queryFn: () => fetchWebsites(searchQueryString),
  });

  return {
    searchQueryString,
    setSearchQueryString,
    ...query,
  };
};
