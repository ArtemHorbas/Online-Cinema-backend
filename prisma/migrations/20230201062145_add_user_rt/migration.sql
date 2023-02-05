/*
  Warnings:

  - Added the required column `rt_hash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rt_hash" TEXT NOT NULL;
