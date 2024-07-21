-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "secret" TEXT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "demoId" TEXT,
ADD COLUMN     "flagged" BOOLEAN NOT NULL DEFAULT false;
