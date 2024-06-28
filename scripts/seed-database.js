/* eslint-disable unicorn/prevent-abbreviations */
const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const randomWords = require("random-words");
const assert = require("node:assert");

const prisma = new PrismaClient();

const random = (minInclusive, maxInclusive) => {
  return (
    Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive
  );
};

const randomElement = (array) => {
  return array[random(0, array.length - 1)];
};

const createFakeUser = () =>
  prisma.user.create({
    data: {
      username: faker.internet.userName(),
      passwordHash: faker.internet.password(),
    },
  });

const createFakeAdmin = (userId) =>
  prisma.admin.create({
    data: {
      userId,
    },
  });

const createFakeAdvertiser = (userId) =>
  prisma.advertiser.create({
    data: {
      userId,
    },
  });

const createFakeWebsite = () =>
  prisma.website.create({
    data: {
      url: faker.internet.url(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
    },
  });

const createFakeAd = (advertiserId, websiteId) =>
  prisma.ad.create({
    data: {
      advertiserId,
      websiteId,
      bid: Number.parseFloat(faker.commerce.price()),
    },
  });

const assignKeywordToWebsite = async (word, websiteId) => {
  let keyword = await prisma.keyword.findUnique({
    where: {
      word,
    },
  });

  if (!keyword) {
    keyword = await prisma.keyword.create({
      data: {
        word,
      },
    });
  }

  assert(keyword);

  let websiteKeyword = await prisma.websiteKeyword.findUnique({
    where: {
      websiteId_keywordId: {
        websiteId,
        keywordId: keyword.id,
      },
    },
  });

  if (!websiteKeyword) {
    websiteKeyword = await prisma.websiteKeyword.create({
      data: {
        websiteId,
        keywordId: keyword.id,
      },
    });
  }

  assert(websiteKeyword);

  return websiteKeyword;
};

const run = async () => {
  console.log("Clearing database...");
  await prisma.ad.deleteMany();
  await prisma.websiteKeyword.deleteMany();
  await prisma.keyword.deleteMany();
  await prisma.advertiser.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database cleared.");

  console.log("Creating users...");
  const [admin, ...advertisers] = await Promise.all(
    Array.from({ length: 3 }, createFakeUser)
  );
  await createFakeAdmin(admin.id);
  await Promise.all(
    advertisers.map((advertiser) => createFakeAdvertiser(advertiser.id))
  );
  console.log("Created admins:");
  console.log(`- ${admin.username}`);
  console.log("Created advertisers:");
  for (const advertiser of advertisers) {
    console.log(`- ${advertiser.username}`);
  }

  console.log("Creating websites...");
  const websites = await Promise.all(
    Array.from({ length: 50 }, createFakeWebsite)
  );
  console.log("Created websites:");
  for (const website of websites) {
    console.log(`- ${website.url}`);
  }

  console.log("Creating ads...");
  const websitesWithAds = websites.slice(0, 10);
  await Promise.all(
    websitesWithAds.map(async (website) => {
      const advertiser = randomElement(advertisers);
      await createFakeAd(advertiser.id, website.id);
    })
  );
  console.log("Created ads for websites:");
  for (const website of websitesWithAds) {
    console.log(`- ${website.url}`);
  }

  console.log("Assigning keywords to websites...");
  const wordsList = randomWords(100);
  await Promise.all(
    wordsList.map(async (word) => {
      const websiteCount = random(1, websites.length / 2);
      for (let i = 0; i < websiteCount; i++) {
        const website = randomElement(websites);
        try {
          await assignKeywordToWebsite(word, website.id);
        } catch (error) {
          console.log(
            `Skipping keyword ${word} for website ${website.url} (${error.name})`
          );
        }
        console.log(`- ${word} -> ${website.url}`);
      }
    })
  );

  console.log("Seeding complete.");
};

run();
