/*
  Warnings:

  - Added the required column `icon` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "icon" TEXT NOT NULL;
