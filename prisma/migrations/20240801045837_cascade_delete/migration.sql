-- DropForeignKey
ALTER TABLE "Ad" DROP CONSTRAINT "Ad_advertiserId_fkey";

-- DropForeignKey
ALTER TABLE "Ad" DROP CONSTRAINT "Ad_websiteId_fkey";

-- DropForeignKey
ALTER TABLE "WebsiteKeyword" DROP CONSTRAINT "WebsiteKeyword_keywordId_fkey";

-- DropForeignKey
ALTER TABLE "WebsiteKeyword" DROP CONSTRAINT "WebsiteKeyword_websiteId_fkey";

-- AddForeignKey
ALTER TABLE "WebsiteKeyword" ADD CONSTRAINT "WebsiteKeyword_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteKeyword" ADD CONSTRAINT "WebsiteKeyword_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "Advertiser"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
