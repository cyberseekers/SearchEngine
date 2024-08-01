"use client";
import { useAutofill } from "@/lib/hooks/use-autofill";
import React, { useEffect, useState } from "react";
import { MdHistory } from "react-icons/md";
import { TbBulb } from "react-icons/tb";

const SearchBar = ({ onSearch, onInputChange, searchHistory }) => {
  const { isSuccess, data, setWord, setKind } = useAutofill(10);

  const [userInput, setUserInput] = useState("");
  const [autofillSuggestionIndex, setAutofillSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState([]);

  const getAutofillSuggestionAtCurrentIndex = () => {
    if (!data) {
      return;
    }

    const realIndex = Math.abs(autofillSuggestionIndex % data.words.length);

    return data.words[realIndex];
  };

  const getCurrentWordAutofillSuggestion = () => {
    if (!isSuccess || data.kind !== "current") {
      return "";
    }

    return getAutofillSuggestionAtCurrentIndex() ?? "";
  };

  const getNextWordAutofillSuggestion = () => {
    if (!isSuccess || data.kind !== "forecast") {
      return "";
    }

    return getAutofillSuggestionAtCurrentIndex() ?? "";
  };

  useEffect(() => {
    setFilteredHistory(
      searchHistory.filter((item) =>
        item.toLowerCase().includes(userInput.toLowerCase())
      )
    );
  }, [userInput, searchHistory]);

  useEffect(() => {
    if (!userInput) {
      return;
    }

    const parts = userInput.match(/\w+|\s+/g) ?? undefined;

    if (parts === undefined || parts.length === 0) {
      setWord("");

      return;
    }

    if (parts.at(-1).trim() === "" && parts.length > 1) {
      // User probably wants to type a new word
      // Last char was a space
      setWord(parts.at(-2));
      setKind("forecast");

      return;
    }

    setWord(parts.at(-1));
    setKind("current");
  }, [userInput, setKind, setWord]);

  const getMultipleSuggestions = () => {
    if (!userInput || !data) {
      return [];
    }

    const parts = userInput.match(/\w+|\s+/g) ?? undefined;

    if (parts === undefined || parts.length === 0) {
      return [];
    }

    const results = (
      data.kind === "current"
        ? data.words.map(
            (word) =>
              userInput.slice(0, userInput.lastIndexOf(parts.at(-1))) + word
          )
        : data.words.map((word) => userInput + (word ?? ""))
    ).filter((item) => userInput !== item);

    return results;
  };

  const getSuggestion = () => {
    if (!userInput) {
      return "";
    }

    const parts = userInput.match(/\w+|\s+/g) ?? undefined;

    const currentSuggestion = getCurrentWordAutofillSuggestion();
    const nextSuggestion = getNextWordAutofillSuggestion();

    if (parts === undefined || parts.length === 0) {
      return "";
    }

    const result =
      parts.at(-1).trim() === "" && parts.length > 1
        ? userInput + (nextSuggestion ?? "")
        : userInput.slice(0, userInput.lastIndexOf(parts.at(-1))) +
          currentSuggestion;

    if (result === userInput) {
      return "";
    }

    return [result, result.length - userInput.length];
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(userInput);
  };

  const handleChange = (event) => {
    setUserInput(event.target.value); // Updates the query state as the user types in the input field
    onInputChange(event.target.value);
  };

  const handleKeypress = (event) => {
    switch (event.key) {
      case "Tab": {
        event.preventDefault();
        const [suggestion] = getSuggestion();
        if (!suggestion) {
          return;
        }
        setUserInput(suggestion);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setAutofillSuggestionIndex((prev) => prev - 1);
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        setAutofillSuggestionIndex((prev) => prev + 1);
        break;
      }
      // No default
    }
  };
  const handleSearch = (query) => {
    setUserInput(query);
    setShowSuggestions(false);
    onSearch(query);

    if (!searchHistory.includes(query)) {
      onInputChange(query);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };
  const combinedSuggestions = [
    ...filteredHistory.map((hist) => ({ type: "history", value: hist })),
    ...(getMultipleSuggestions().map((word) => ({
      type: "autofill",
      value: word,
    })) || []),
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center mt-10 gap-4"
    >
      <div className="relative w-4/5 max-w-lg">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-black"
          value={userInput}
          onChange={handleChange}
          onKeyDown={handleKeypress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          placeholder="Enter your search query here..."
        />
        {showSuggestions && userInput.trim() !== "" && (
          <div className="absolute bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg z-10">
            <ul>
              {combinedSuggestions.length > 0 ? (
                combinedSuggestions.map((item, index) => (
                  <li
                    key={index}
                    className={`p-2 hover:bg-gray-200 cursor-pointer ${
                      item.type === "history" ? "text-purple-600" : ""
                    } ${item.type === "autofill" ? "font-bold" : ""}`}
                    onClick={() => handleSuggestionClick(item.value)}
                  >
                    {item.type === "history" && (
                      <MdHistory className="inline-block mr-2" />
                    )}
                    {item.type === "autofill" && (
                      <TbBulb className="inline-block mr-2" />
                    )}
                    {item.value}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No suggestions found</li>
              )}
            </ul>
          </div>
        )}
        <SuggestionOverlay suggestion={getSuggestion()} />
      </div>
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

const SuggestionOverlay = ({ suggestion: [suggestion, diff] }) => {
  if (!suggestion) {
    return;
  }

  const skip = suggestion.length - diff;

  return (
    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black pointer-events-none opacity-50">
      {[...suggestion].map((char, index) => (
        <span
          key={`${char}${index}`}
          className={`${index < skip ? "opacity-0" : ""}`}
        >
          {char}
        </span>
      ))}
    </span>
  );
};
