"use client";
import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  const handleChange = (event) => {
    setQuery(event.target.value); // Updates the query state as the user types in the input field
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center mt-10 gap-4"
    >
      <input
        type="text"
        className="w-4/5 max-w-lg p-2 border border-gray-300 rounded-md text-black"
        value={query}
        onChange={handleChange}
        placeholder="Enter your search query here..."
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
