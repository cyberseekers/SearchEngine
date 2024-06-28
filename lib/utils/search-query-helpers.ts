import { Prisma, PrismaClient } from "@prisma/client";
import { SearchNode, parseSearchString } from "./search-string-parser";

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

  // Sort by relevance, i.e. the number of keywords that matched the search
  // string.
  // Usually we'd do something like this in the database query itself, but
  // Prisma doesn't support this kind of sorting yet.
  websites
    .sort((a, b) => {
      const aMatched = a.websiteKeywords.filter((keyword) =>
        words.includes(keyword.Keyword.word)
      ).length;
      const bMatched = b.websiteKeywords.filter((keyword) =>
        words.includes(keyword.Keyword.word)
      ).length;

      return bMatched - aMatched;
    })
    .sort((a, b) => {
      // Sort by ad bid amount in descending order.
      const aAdsBidSum = a.ads.reduce((sum, ad) => sum + ad.bid, 0);
      const bAdsBidSum = b.ads.reduce((sum, ad) => sum + ad.bid, 0);

      return bAdsBidSum - aAdsBidSum;
    });

  return websites;
};
