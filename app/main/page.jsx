"use client";
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResult";

const Main = () => {
  const [results, setResults] = useState([]);

  const handleSearch = (query) => {
    // Sample data for demonstration
    const sampleData = [
      {
        title:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident recusandae veniam dolore sint illum itaque quidem laudantium quibusdam impedit inventore illo quod unde, maxime dolorem, dicta voluptatibus dignissimos nesciunt sed.",
        url: "http://kk.com",
        description:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident recusandae veniam dolore sint illum itaque quidem laudantium quibusdam impedit inventore illo quod unde, maxime dolorem, dicta voluptatibus dignissimos nesciunt sed.",
      },
      {
        title:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident recusandae veniam dolore sint illum itaque quidem laudantium quibusdam impedit inventore illo quod unde, maxime dolorem, dicta voluptatibus dignissimos nesciunt sed.",
        url: "http://kk.org",
        description:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident recusandae veniam dolore sint illum itaque quidem laudantium quibusdam impedit inventore illo quod unde, maxime dolorem, dicta voluptatibus dignissimos nesciunt sed.",
      },
    ];

    // Filter sample data based on the query
    const filteredResults = sampleData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filteredResults);
  };

  return (
    <div className="font-sans bg-gray-100 text-center p-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-black">Search Engine</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResults results={results} />
    </div>
  );
};

export default Main;
