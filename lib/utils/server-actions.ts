"use server";

import { prisma } from "../database";

export const incrementClickCount = async (websiteId: number) => {
  return prisma.website.update({
    where: {
      id: websiteId,
    },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });
};
