import React, { useState, useEffect } from "react";
import { fetchWebsites} from "@/lib/utils/search-query-helpers";

const Tool = () => {
  const [showResults, setShowResults] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (showResults) {
        try {
          const startTime = Date.now();
          const { results } = await fetchWebsites("");
          const endTime = Date.now();
          setResultsCount(results.length);
          setSearchTime((endTime - startTime) / 1000);
        } catch (error) {
          console.error("Error", error);
        }
      }
    };

    fetchData();
  }, [showResults]);

  const toggleResults = () => {
    setShowResults(!showResults);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        <button
          className="ml-2 px-2 py-1 text-gray-600 rounded hover:bg-gray-300"
          onClick={toggleResults}
        >
          {showResults ? "Tools" : "Tools"}
        </button>
      </h2>
      {showResults && (
        <div className="text-center">
          <p className="text-lg text-gray-500">
            About {resultsCount.toLocaleString()} results (
            {searchTime.toFixed(2)} seconds)
          </p>
        </div>
      )}
    </div>
  );
};

export default Tool;
