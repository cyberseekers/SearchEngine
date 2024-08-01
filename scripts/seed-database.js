/* eslint-disable unicorn/prevent-abbreviations */
const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const fs = require("node:fs");
const csv = require("csv");

const prisma = new PrismaClient();

/**
 * An async generator that yields sample websites from a CSV file.
 */
async function* sampleWebsites() {
  const csvFilePath = "./__tests__/fixtures/sample-websites.csv";
  const records = fs.createReadStream(csvFilePath).pipe(
    csv.parse({
      columns: () => ["url", "title", "description", "keywords"],
    })
  );

  for await (const record of records) {
    /**
     * @type {{url: string; title: string; description: string; keywords: string[];}}
     */
    const websiteRecord = {
      url: record.url,
      title: record.title,
      description: record.description,
      keywords: record.keywords.split(",").map((keyword) => keyword.trim()),
    };

    yield websiteRecord;
  }
}

/**
 * Generates a random number between `min` and `max` (inclusive).
 */
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Returns a random element from an array.
 */
const randomElement = (array) => {
  return array[random(0, array.length - 1)];
};

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const createFakeUser = () =>
  prisma.user.create({
    data: {
      username: faker.internet.userName(),
      passwordHash: faker.internet.password(),
    },
  });


// createSpecificUser-- This creates a specific user for testing purposes
const createSpecificUser = (username, password) =>
  prisma.user.create({
    data: {
      username: username,
      passwordHash: password,
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

const getOrCreateKeyword = async (word) => {
  const keyword = await prisma.keyword.findUnique({
    where: {
      word,
    },
  });

  if (keyword) {
    return keyword;
  }

  return prisma.keyword.create({
    data: {
      word,
    },
  });
};

const createWebsiteRecords = async () => {
  for await (const website of sampleWebsites()) {
    const websiteRecord = await prisma.website.create({
      data: {
        url: website.url,
        title: website.title,
        description: website.description,
      },
    });

    const keywords = await Promise.all(
      website.keywords.map((word) => getOrCreateKeyword(word))
    );

    await prisma.websiteKeyword.createMany({
      data: keywords.map((keyword) => ({
        websiteId: websiteRecord.id,
        keywordId: keyword.id,
      })),
    });
  }
};

const createFakeAd = async (advertiserId, websiteId) =>
  prisma.ad.create({
    data: {
      bid: Number.parseFloat(faker.finance.amount()),
      advertiserId,
      websiteId,
    },
  });

const run = async () => {
  console.log("Clearing database...");
  await prisma.ad.deleteMany();
  await prisma.websiteKeyword.deleteMany();
  await prisma.keyword.deleteMany();
  await prisma.advertiser.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.website.deleteMany();
  console.log("Database cleared.");

  console.log("Creating users...");
  const [admin, ...advertisers] = await Promise.all(
    Array.from({ length: 3 }, createFakeUser)
  );

  // create the specific user
  const specificUser = await createSpecificUser('testUser', 'abc123');

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

  // Log the created specific user
  console.log('Created specific user:');
  console.log(`- Username: ${specificUser.username}`);
  console.log(`- Password: ${specificUser.password}`);

  console.log("Creating websites...");
  await createWebsiteRecords();
  const websites = await prisma.website.findMany({
    include: {
      websiteKeywords: {
        include: {
          Keyword: true,
        },
      },
    },
  });
  console.log("Created websites:");
  for (const website of websites) {
    console.log(`- ${website.url}`);
    console.log(`  - Title: ${website.title}`);
    console.log(`  - Description: ${website.description}`);
    console.log(
      `  - Keywords: ${website.websiteKeywords
        .map((wk) => wk.Keyword.word)
        .join(", ")}`
    );
  }

  console.log("Creating ads...");
  const websitesWithAds = shuffle(websites).slice(0, 10);
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

  console.log("Seeding complete.");
};

run();
