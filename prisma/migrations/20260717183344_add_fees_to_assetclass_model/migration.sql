-- CreateEnum
CREATE TYPE "RiskProfile" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "FundType" AS ENUM ('OPEN_ENDED', 'CLOSED_ENDED', 'HYBRID');

-- CreateTable
CREATE TABLE "AssetClassFee" (
    "id" TEXT NOT NULL,
    "assetClassId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetClassFee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssetClassFee" ADD CONSTRAINT "AssetClassFee_assetClassId_fkey" FOREIGN KEY ("assetClassId") REFERENCES "AssetClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
