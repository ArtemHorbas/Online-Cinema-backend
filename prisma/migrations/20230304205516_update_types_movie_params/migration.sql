/*
  Warnings:

  - Changed the type of `year` on the `MovieParams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `duration` on the `MovieParams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "MovieParams" DROP CONSTRAINT "MovieParams_movie_id_fkey";

-- AlterTable
ALTER TABLE "MovieParams" DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL,
DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MovieParams" ADD CONSTRAINT "MovieParams_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
