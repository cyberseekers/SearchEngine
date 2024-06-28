import { prisma } from "@/lib/database";
import { fetchWebsites } from "@/lib/utils/search-query-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParameters = request.nextUrl.searchParams;
  const query = searchParameters.get("q") || searchParameters.get("query");

  if (!query) {
    return NextResponse.json([]);
  }

  const results = await fetchWebsites(prisma, query.replaceAll("+", " "));

  return NextResponse.json(results);
}