/*
  Warnings:

  - A unique constraint covering the columns `[adzuna_id]` on the table `KeywordJob` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "KeywordJob_adzuna_id_key" ON "KeywordJob"("adzuna_id");
