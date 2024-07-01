import { WebsiteSortMode } from "@/lib/types/search";
import { useState } from "react";

interface SearchOptionsProps {
  onSortChange: (option: WebsiteSortMode) => void;
  onHideAdsChange: (hideAds: boolean) => void;
}

export const SearchOptions = ({
  onSortChange,
  onHideAdsChange,
}: SearchOptionsProps) => {
  const [sortOption, setSortOption] = useState(
    WebsiteSortMode.SORT_BY_RELEVANCE
  );
  const [hideAds, setHideAds] = useState(false);

  const handleSortChange = (option) => {
    setSortOption(option);
    onSortChange(option);
  };

  const handleHideAdsChange = () => {
    setHideAds(!hideAds);
    onHideAdsChange(!hideAds);
  };

  return (
    <div className="flex justify-center items-center space-x-2 p-2 bg-gray-100 rounded-lg text-sm">
      <div className="flex items-center space-x-1">
        <label className="text-gray-700 font-semibold">Sort by:</label>
        <button
          className={`px-2 py-1 rounded ${
            sortOption === WebsiteSortMode.SORT_BY_RELEVANCE
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border"
          }`}
          onClick={() => handleSortChange(WebsiteSortMode.SORT_BY_RELEVANCE)}
        >
          Relevance
        </button>
        <button
          className={`px-2 py-1 rounded ${
            sortOption === WebsiteSortMode.SORT_ALPHABETICALLY
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border"
          }`}
          onClick={() => handleSortChange(WebsiteSortMode.SORT_ALPHABETICALLY)}
        >
          Alphabetically
        </button>
        <button
          className={`px-2 py-1 rounded ${
            sortOption === WebsiteSortMode.SORT_BY_CLICKS
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border"
          }`}
          onClick={() => handleSortChange(WebsiteSortMode.SORT_BY_CLICKS)}
        >
          Popularity
        </button>
      </div>
      <div className="flex items-center space-x-1">
        <label className="text-gray-700 font-semibold">Hide ads:</label>
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 text-blue-600"
          checked={hideAds}
          onChange={handleHideAdsChange}
        />
      </div>
    </div>
  );
};
