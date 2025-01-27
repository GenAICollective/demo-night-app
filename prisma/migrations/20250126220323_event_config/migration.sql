/*
  Warnings:

  - You are about to drop the column `partners` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "partners",
ADD COLUMN     "config" JSONB NOT NULL DEFAULT '{}';

-- CreateIndex
CREATE INDEX "Award_eventId_idx" ON "Award"("eventId");

-- CreateIndex
CREATE INDEX "Demo_eventId_idx" ON "Demo"("eventId");
