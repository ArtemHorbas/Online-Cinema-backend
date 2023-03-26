-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC', 'ADMIN', 'EDITOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'BASIC';
