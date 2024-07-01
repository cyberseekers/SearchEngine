import { prisma } from "@/lib/database";
import { AutofillResponse } from "@/lib/types/autofill";
import { getAutofillWords, getRelatedKeywords } from "@/lib/utils/autofill";
import { NextRequest, NextResponse } from "next/server";

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

  const suggestions =
    kind === "current"
      ? await getAutofillWords(prisma, word, maxResults)
      : await getRelatedKeywords(prisma, word, maxResults);

  return NextResponse.json({
    kind,
    words: suggestions,
  } satisfies AutofillResponse);
}
