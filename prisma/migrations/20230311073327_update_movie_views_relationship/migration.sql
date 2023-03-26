/*
  Warnings:

  - You are about to drop the column `movie_id` on the `MovieViews` table. All the data in the column will be lost.
  - Added the required column `movie_slug` to the `MovieViews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MovieViews" DROP CONSTRAINT "MovieViews_movie_id_fkey";

-- AlterTable
ALTER TABLE "MovieViews" DROP COLUMN "movie_id",
ADD COLUMN     "movie_slug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MovieViews" ADD CONSTRAINT "MovieViews_movie_slug_fkey" FOREIGN KEY ("movie_slug") REFERENCES "Movie"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
