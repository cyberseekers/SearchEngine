import type { fetchWebsites } from "../utils/search-query-helpers";

export enum WebsiteSortMode {
  SORT_BY_RELEVANCE = "relevance",
  SORT_ALPHABETICALLY = "alphabetically",
  SORT_BY_ADS = "ads",
  SORT_BY_CLICKS = "clicks",
}

export type FetchWebsitesResult = Awaited<ReturnType<typeof fetchWebsites>>;
