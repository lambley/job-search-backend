/*
  Warnings:

  - Changed the type of `status` on the `KeywordJob` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "KeywordJobStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "KeywordJob" DROP COLUMN "status",
ADD COLUMN     "status" "KeywordJobStatus" NOT NULL;
