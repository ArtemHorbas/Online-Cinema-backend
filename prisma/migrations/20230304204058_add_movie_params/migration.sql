/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[video]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "bigPoster" TEXT NOT NULL DEFAULT '/uploads/movie/no-image.png',
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "video" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MovieParams" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,

    CONSTRAINT "MovieParams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieParams_movie_id_key" ON "MovieParams"("movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_slug_key" ON "Movie"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_video_key" ON "Movie"("video");

-- AddForeignKey
ALTER TABLE "MovieParams" ADD CONSTRAINT "MovieParams_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
