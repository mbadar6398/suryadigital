/*
  Warnings:

  - Added the required column `scheduled_at` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "message" ADD COLUMN     "scheduled_at" TIMESTAMP NOT NULL;
