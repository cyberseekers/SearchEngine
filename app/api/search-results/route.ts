import { prisma } from "@/lib/database";
import { Pageable } from "@/lib/types/pageable";
import { FetchWebsitesResult, WebsiteSortMode } from "@/lib/types/search";
import { fetchWebsites } from "@/lib/utils/search-query-helpers";
import { NextRequest, NextResponse } from "next/server";

const sortModeMap = {
  relevance: WebsiteSortMode.SORT_BY_RELEVANCE,
  alphabetically: WebsiteSortMode.SORT_ALPHABETICALLY,
  ads: WebsiteSortMode.SORT_BY_ADS,
  clicks: WebsiteSortMode.SORT_BY_CLICKS,
};

export async function GET(request: NextRequest) {
  const searchParameters = request.nextUrl.searchParams;

  const query = searchParameters.get("q");

  const requestedSortModes = searchParameters
    .get("sort")
    .split(",")
    .map((mode) => sortModeMap[mode])
    .filter(Boolean) as WebsiteSortMode[];
  const sortModes =
    requestedSortModes.length > 0
      ? requestedSortModes
      : [WebsiteSortMode.SORT_BY_ADS, WebsiteSortMode.SORT_BY_RELEVANCE];

  const pageNumber = Number.parseInt(searchParameters.get("page") ?? "1", 10);
  const pageSize = Number.parseInt(
    searchParameters.get("pageSize") ?? "10",
    10
  );

  if (!query) {
    return NextResponse.json([]);
  }

  const results = await fetchWebsites(
    prisma,
    query.replaceAll("+", " "),
    sortModes
  );

  // pagination
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const content = results.slice(startIndex, endIndex);
  const totalElements = results.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const hasNext = endIndex < totalElements;
  const hasPrevious = startIndex > 0;

  return NextResponse.json({
    content,
    pageNumber,
    pageSize,
    totalElements,
    totalPages,
    hasNext,
    hasPrevious,
  } satisfies Pageable<FetchWebsitesResult>);
}
