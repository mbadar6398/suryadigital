/*
  Warnings:

  - You are about to drop the column `userId` on the `message` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_userId_fkey";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
