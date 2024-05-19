/*
  Warnings:

  - You are about to drop the column `failed` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "message" DROP COLUMN "failed",
ALTER COLUMN "sent_at" DROP NOT NULL;
