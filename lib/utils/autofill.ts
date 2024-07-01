import { PrismaClient } from "@prisma/client";

export const getRelatedKeywords = async (
  prisma: PrismaClient,
  word: string,
  maxResults: number
) => {
  const keyword = await prisma.keyword.findUnique({
    where: {
      word,
    },
  });

  if (!keyword) {
    return [];
  }

  const relatedKeywords = await prisma.keyword.findMany({
    where: {
      websiteKeywords: {
        some: {
          Website: {
            websiteKeywords: {
              some: {
                keywordId: keyword.id,
              },
            },
          },
        },
      },
    },
    orderBy: {
      word: "asc",
    },
    distinct: ["id"],
    take: maxResults,
  });

  const filteredRelatedKeywords = relatedKeywords.filter(
    (relatedKeyword) => relatedKeyword.word !== word
  );

  return filteredRelatedKeywords.map(({ word }) => word);
};

export const getAutofillWords = async (
  prisma: PrismaClient,
  word: string,
  maxResults: number
) => {
  const exactMatch = await prisma.keyword.findUnique({
    where: {
      word,
    },
  });

  if (exactMatch) {
    return [exactMatch.word];
  }

  const similarWords = await prisma.keyword.findMany({
    where: {
      word: {
        startsWith: word,
      },
    },
    orderBy: {
      word: "asc",
    },
    take: maxResults,
    distinct: ["id"],
  });

  if (similarWords.length === 0) {
    return [];
  }

  return similarWords.map(({ word }) => word);
};
