/*
  Warnings:

  - A unique constraint covering the columns `[adzuna_id]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adzuna_id` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "adzuna_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_adzuna_id_key" ON "Job"("adzuna_id");
