/*
  Warnings:

  - You are about to drop the column `bigPoster` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `big_poster` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "bigPoster",
ADD COLUMN     "big_poster" TEXT NOT NULL;
