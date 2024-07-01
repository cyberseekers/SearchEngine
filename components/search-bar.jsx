"use client";
import { useAutofill } from "@/lib/hooks/use-autofill";
import React, { useEffect, useState } from "react";

const SearchBar = ({ onSearch }) => {
  const { isSuccess, data, setWord, setKind } = useAutofill(1);

  const getCurrentWordAutofillSuggestion = () => {
    if (!isSuccess || data.kind !== "current") {
      return "";
    }

    return data.words[0] ?? "";
  };

  const getNextWordAutofillSuggestion = () => {
    if (!isSuccess || data.kind !== "forecast") {
      return "";
    }

    return data.words[0] ?? "";
  };

  const [userInput, setUserInput] = useState("");

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
  };

  const handleKeypress = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();

      const [suggestion] = getSuggestion();

      if (!suggestion) {
        return;
      }

      setUserInput(suggestion);
    }
  };

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
          placeholder="Enter your search query here..."
        />
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
