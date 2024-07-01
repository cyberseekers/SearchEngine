"use client";
import { incrementClickCount } from "@/lib/utils/server-actions";
import React from "react";

const SearchResults = ({ results, hideAds }) => {
  return (
    <div className="mt-4 text-left w-4/5 max-w-lg mx-auto">
      {results === undefined || results.length === 0 ? (
        <p className="text-center text-gray-500">No results found.</p>
      ) : (
        results.map((item) => (
          <SearchResultCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            url={item.url}
            isAd={!hideAds && item.ads.length > 0}
          />
          // <div
          //   key={index}
          //   className="bg-white p-4 mb-4 border border-gray-300 rounded-md"
          // >
          //   <div className="font-bold text-xl">{item.title}</div>
          //   <div className="text-sm text-gray-600">{item.url}</div>
          //   <div className="text-lg text-gray-700">{item.description}</div>
          // </div>
        ))
      )}
    </div>
  );
};

const SearchResultCard = ({ id, title, description, url, isAd }) => {
  return (
    <div
      className={`flex border p-4 rounded-lg ${
        isAd ? "bg-yellow-50" : "bg-white"
      } mb-4 items-start`}
    >
      {isAd && (
        <div className="text-sm text-red-500 font-semibold mr-4">Ad</div>
      )}
      <div className="flex-grow">
        <a
          onClick={() => {
            incrementClickCount(id);
          }}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-lg font-bold"
        >
          {title}
        </a>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 ml-2"
        >
          {url}
        </a>
        <p className="text-gray-700 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default SearchResults;
