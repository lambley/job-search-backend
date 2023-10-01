-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT[],
    "description" TEXT NOT NULL,
    "created" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "salary_min" DOUBLE PRECISION NOT NULL,
    "salary_max" DOUBLE PRECISION NOT NULL,
    "contract_type" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
