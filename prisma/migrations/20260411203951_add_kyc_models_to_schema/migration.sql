-- CreateEnum
CREATE TYPE "OrganizationDocumentType" AS ENUM ('CERTIFICATE_OF_INCORPORATION', 'MEMORANDUM_OF_ASSOCIATION', 'PROOF_OF_BUSINESS_ADDRESS');

-- AlterEnum
ALTER TYPE "KycStatus" ADD VALUE 'UNCOMPLETED';

-- CreateTable
CREATE TABLE "IndividualKyc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "idType" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "idFrontPath" TEXT,
    "idBackPath" TEXT,
    "selfieWithIdPath" TEXT,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "residenceType" TEXT NOT NULL,
    "residenceDocPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndividualKyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationKyc" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "taxResidence" TEXT,
    "taxIdNumber" TEXT,
    "status" "KycStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationKyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeneficialOwner" (
    "id" TEXT NOT NULL,
    "kycId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "idType" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "idFrontUrl" TEXT,
    "idBackUrl" TEXT,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BeneficialOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationDocument" (
    "id" TEXT NOT NULL,
    "kycId" TEXT NOT NULL,
    "type" "OrganizationDocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "OrganizationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IndividualKyc_userId_key" ON "IndividualKyc"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationKyc_organizationId_key" ON "OrganizationKyc"("organizationId");

-- AddForeignKey
ALTER TABLE "IndividualKyc" ADD CONSTRAINT "IndividualKyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationKyc" ADD CONSTRAINT "OrganizationKyc_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeneficialOwner" ADD CONSTRAINT "BeneficialOwner_kycId_fkey" FOREIGN KEY ("kycId") REFERENCES "OrganizationKyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDocument" ADD CONSTRAINT "OrganizationDocument_kycId_fkey" FOREIGN KEY ("kycId") REFERENCES "OrganizationKyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
