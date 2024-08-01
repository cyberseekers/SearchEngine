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

export const deleteWebsite = async (websiteId: number) => {
  return prisma.website.delete({
    where: {
      id: websiteId,
    },
  });
};
