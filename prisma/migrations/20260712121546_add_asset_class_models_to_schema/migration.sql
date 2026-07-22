-- CreateTable
CREATE TABLE "AssetClass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "acronym" TEXT,
    "headline" TEXT,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "coverImage" TEXT,
    "themeColor" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "fundType" TEXT,
    "riskProfile" TEXT,
    "allocationSource" TEXT,
    "investmentHorizon" TEXT,
    "lockupPeriod" TEXT,
    "minimumInvestment" DOUBLE PRECISION NOT NULL,
    "maximumInvestment" DOUBLE PRECISION,
    "targetAllocationPercent" DOUBLE PRECISION,
    "targetReturn" TEXT,
    "managementFee" DOUBLE PRECISION,
    "performanceFee" DOUBLE PRECISION,
    "hurdleRate" DOUBLE PRECISION,
    "highWaterMark" TEXT,
    "managementFeeDescription" TEXT,
    "performanceFeeDescription" TEXT,
    "riskDisclosure" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetClassCriterion" (
    "id" TEXT NOT NULL,
    "assetClassId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "signal" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetClassCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetClassFlowStep" (
    "id" TEXT NOT NULL,
    "assetClassId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badge" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetClassFlowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetClassRequirement" (
    "id" TEXT NOT NULL,
    "assetClassId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetClassRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetClassUniverse" (
    "id" TEXT NOT NULL,
    "assetClassId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAllocation" DOUBLE PRECISION,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetClassUniverse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetClass_slug_key" ON "AssetClass"("slug");

-- AddForeignKey
ALTER TABLE "AssetClassCriterion" ADD CONSTRAINT "AssetClassCriterion_assetClassId_fkey" FOREIGN KEY ("assetClassId") REFERENCES "AssetClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetClassFlowStep" ADD CONSTRAINT "AssetClassFlowStep_assetClassId_fkey" FOREIGN KEY ("assetClassId") REFERENCES "AssetClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetClassRequirement" ADD CONSTRAINT "AssetClassRequirement_assetClassId_fkey" FOREIGN KEY ("assetClassId") REFERENCES "AssetClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetClassUniverse" ADD CONSTRAINT "AssetClassUniverse_assetClassId_fkey" FOREIGN KEY ("assetClassId") REFERENCES "AssetClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
