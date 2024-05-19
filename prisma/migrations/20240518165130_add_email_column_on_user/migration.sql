/*
  Warnings:

  - Added the required column `email` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_timezone_key";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email" VARCHAR NOT NULL;
