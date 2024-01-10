-- CreateTable
CREATE TABLE "KeywordJob" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "adzuna_id" TEXT NOT NULL,
    "jobId" INTEGER,
    "status" TEXT NOT NULL,

    CONSTRAINT "KeywordJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KeywordJob" ADD CONSTRAINT "KeywordJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
