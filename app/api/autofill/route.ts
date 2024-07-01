import { prisma } from "@/lib/database";
import {
  getCachedAutofillResult,
  setCachedAutofillResult,
} from "@/lib/database/cache";
import { AutofillResponse } from "@/lib/types/autofill";
import { getAutofillWords, getRelatedKeywords } from "@/lib/utils/autofill";
import { NextRequest, NextResponse } from "next/server";

const fetchAndCacheAutofillResult = async (
  kind: "current" | "forecast",
  word: string,
  maxResults: number
) => {
  const suggestions =
    kind === "current"
      ? await getAutofillWords(prisma, word, maxResults)
      : await getRelatedKeywords(prisma, word, maxResults);

  const result = {
    kind,
    words: suggestions,
  } satisfies AutofillResponse;

  // Do not await to avoid blocking the response
  setCachedAutofillResult(kind, word, maxResults, result);

  return result;
};

export async function GET(request: NextRequest) {
  const searchParameters = request.nextUrl.searchParams;
  const word = searchParameters.get("word") ?? "";
  const kind =
    searchParameters.get("kind") === "forecast" ? "forecast" : "current";
  const maxResults = Number.parseInt(
    searchParameters.get("maxResults") ?? "5",
    10
  );

  if (word.length === 0) {
    return NextResponse.json({
      kind,
      words: [],
    } satisfies AutofillResponse);
  }

  // Try to get the cached result
  const cachedResult = await getCachedAutofillResult(kind, word, maxResults);
  if (cachedResult) {
    return NextResponse.json(cachedResult);
  }

  const result = await fetchAndCacheAutofillResult(kind, word, maxResults);

  return NextResponse.json(result);
}
