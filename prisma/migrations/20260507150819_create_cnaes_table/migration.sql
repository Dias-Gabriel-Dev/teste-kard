-- CreateTable
CREATE TABLE "cnaes" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "cnae_complete" TEXT NOT NULL,
    "cnae_class" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "turnover" DOUBLE PRECISION NOT NULL,
    "risk_range" TEXT NOT NULL,
    "cnae_score" INTEGER NOT NULL,

    CONSTRAINT "cnaes_pkey" PRIMARY KEY ("id")
);
