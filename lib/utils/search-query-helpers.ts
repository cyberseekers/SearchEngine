import { Prisma, PrismaClient } from "@prisma/client";
import { SearchNode, parseSearchString } from "./search-string-parser";
import { FetchWebsitesResult, WebsiteSortMode } from "../types/search";

const searchNodeToPrismaWebsiteWhereInput = (
  node: SearchNode,
  caseInsensitive = false
): Prisma.WebsiteWhereInput => {
  const traverse = (node: SearchNode): Prisma.WebsiteWhereInput => {
    switch (node.kind) {
      case "and": {
        return {
          AND: node.content.map((content) => traverse(content)),
        };
      }
      case "or": {
        return {
          OR: node.content.map((content) => traverse(content)),
        };
      }
      case "not": {
        return {
          NOT: traverse(node.content),
        };
      }
      case "wordGroup": {
        return {
          websiteKeywords: {
            some: {
              Keyword: {
                word: {
                  in: node.content,
                  mode: caseInsensitive ? "insensitive" : "default",
                },
              },
            },
          },
        };
      }
    }
  };

  return traverse(node);
};

/**
 * Fetches websites from the database based on the provided search string.
 *
 * @param prisma - The Prisma client instance. Should be imported from
 * `@/lib/database`.
 * @param searchString - The search string to match against website data.
 * @param sortModes - Optional. An array of modes to sort the results by. Defaults to
 * `["ads", "relevance"]`. Multiple modes can be specified, and the results will
 * be sorted by the first mode first, then the second mode, and so on.
 * @param caseInsensitive - Optional. Specifies whether the search should be
 * case-insensitive. Defaults to false.
 *
 * @example
 * ```ts
 * const websites = await fetchWebsites(prisma, "foo AND bar OR baz one two AND NOT qux");
 * ```
 */
export const fetchWebsites = async (
  prisma: PrismaClient,
  searchString: string,
  sortModes: WebsiteSortMode[] = [
    WebsiteSortMode.SORT_BY_ADS,
    WebsiteSortMode.SORT_BY_RELEVANCE,
  ],
  caseInsensitive = false
) => {
  const [tree, words] = parseSearchString(searchString);

  const query = {
    where: searchNodeToPrismaWebsiteWhereInput(tree, caseInsensitive),
    include: {
      websiteKeywords: {
        include: {
          Keyword: true,
        },
      },
      ads: true,
    } satisfies Prisma.WebsiteInclude,
  };

  const websites = await prisma.website.findMany(query);

  for (const sortMode of [...sortModes].reverse()) {
    switch (sortMode) {
      case WebsiteSortMode.SORT_BY_RELEVANCE: {
        websites.sort(sortByRelevance(words));
        break;
      }
      case WebsiteSortMode.SORT_BY_ADS: {
        websites.sort(sortByAds);
        break;
      }
      case WebsiteSortMode.SORT_ALPHABETICALLY: {
        websites.sort(sortAlphabetically);
        break;
      }
      case WebsiteSortMode.SORT_BY_CLICKS: {
        websites.sort(sortByClicks);
        break;
      }
    }
  }

  return websites;
};

const sortByRelevance =
  (words: string[]) =>
  (a: FetchWebsitesResult[number], b: FetchWebsitesResult[number]) => {
    const aMatched = a.websiteKeywords.filter((keyword) =>
      words.includes(keyword.Keyword.word)
    ).length;
    const bMatched = b.websiteKeywords.filter((keyword) =>
      words.includes(keyword.Keyword.word)
    ).length;

    return bMatched - aMatched;
  };

const sortByAds = (
  a: FetchWebsitesResult[number],
  b: FetchWebsitesResult[number]
) => {
  const aAdsBidSum = a.ads.reduce((sum, ad) => sum + ad.bid, 0);
  const bAdsBidSum = b.ads.reduce((sum, ad) => sum + ad.bid, 0);

  return bAdsBidSum - aAdsBidSum;
};

const sortAlphabetically = (
  a: FetchWebsitesResult[number],
  b: FetchWebsitesResult[number]
) => a.url.localeCompare(b.url);

const sortByClicks = (
  a: FetchWebsitesResult[number],
  b: FetchWebsitesResult[number]
) => b.clickCount - a.clickCount;
