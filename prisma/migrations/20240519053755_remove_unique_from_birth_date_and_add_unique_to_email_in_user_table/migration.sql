/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_birth_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");