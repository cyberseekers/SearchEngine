import { Prisma } from "@prisma/client";
import { SearchNode, parseSearchString } from "./search-string-parser";

const searchNodeToPrismaQuery = (
  node: SearchNode,
  caseInsensitive = false
): Prisma.KeywordWhereInput => {
  const searchNodeToPrismaQueryInner = (
    node: SearchNode
  ): Prisma.KeywordWhereInput => {
    switch (node.kind) {
      case "and": {
        return {
          AND: node.content.map((content) =>
            searchNodeToPrismaQueryInner(content)
          ),
        };
      }
      case "or": {
        return {
          OR: node.content.map((content) =>
            searchNodeToPrismaQueryInner(content)
          ),
        };
      }
      case "not": {
        return {
          NOT: searchNodeToPrismaQueryInner(node.content),
        };
      }
      case "word": {
        if (caseInsensitive) {
          return {
            word: {
              equals: node.content,
              mode: "insensitive",
            },
          };
        }

        return {
          word: node.content,
        };
      }
      case "wordGroup": {
        return {
          // It seems better to use `AND` here, but switching it to `OR` will
          // work as well. `AND` allows for better keyword suggestions.
          AND: node.content.map((content) =>
            searchNodeToPrismaQueryInner(content)
          ),
        };
      }
    }
  };

  return searchNodeToPrismaQueryInner(node);
};

/**
 * Given a search string, returns a Prisma query object that can be used to
 * search for keywords.
 *
 * @param searchString The search string to parse.
 * @param caseInsensitive Whether to perform a case-insensitive search.
 *
 * @example
 * ```typescript
 * const query = createSearchQuery("foo bar OR baz");
 * const keywords = await prisma.keyword.findMany(query);
 * ```
 */
export const createPrismaKeywordQueryObject = (
  searchString: string,
  caseInsensitive = false
) => {
  const tree = parseSearchString(searchString);

  return { where: searchNodeToPrismaQuery(tree, caseInsensitive) } as const;
};
