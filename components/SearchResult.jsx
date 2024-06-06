"use client";
import React from "react";

const SearchResults = ({ results }) => {
  return (
    <div className="mt-8 text-left w-4/5 max-w-lg mx-auto">
      {results.length === 0 ? (
        <p className="text-center text-gray-500">No results found.</p>
      ) : (
        results.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 mb-4 border border-gray-300 rounded-md"
          >
            <div className="font-bold text-xl">{item.title}</div>
            <div className="text-sm text-gray-600">{item.url}</div>
            <div className="text-lg text-gray-700">{item.description}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;
