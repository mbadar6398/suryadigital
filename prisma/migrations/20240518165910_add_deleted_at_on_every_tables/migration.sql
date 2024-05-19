-- AlterTable
ALTER TABLE "message" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deleted_at" TIMESTAMP;
