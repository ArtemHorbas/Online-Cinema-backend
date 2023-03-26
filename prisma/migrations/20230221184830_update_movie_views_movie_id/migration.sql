/*
  Warnings:

  - You are about to drop the column `movieId` on the `MovieViews` table. All the data in the column will be lost.
  - Added the required column `movie_id` to the `MovieViews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MovieViews" DROP CONSTRAINT "MovieViews_movieId_fkey";

-- AlterTable
ALTER TABLE "MovieViews" DROP COLUMN "movieId",
ADD COLUMN     "movie_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MovieViews" ADD CONSTRAINT "MovieViews_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
