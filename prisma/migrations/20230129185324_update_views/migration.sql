/*
  Warnings:

  - You are about to drop the column `views` on the `MovieViews` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "MovieViews_movieId_key";

-- AlterTable
ALTER TABLE "MovieViews" DROP COLUMN "views",
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0;
