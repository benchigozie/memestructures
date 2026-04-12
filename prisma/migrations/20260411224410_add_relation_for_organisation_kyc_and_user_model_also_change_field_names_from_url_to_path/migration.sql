/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `OrganizationDocument` table. All the data in the column will be lost.
  - You are about to drop the `BeneficialOwner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `filePath` to the `OrganizationDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrganizationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KycRole" AS ENUM ('UBO', 'DIRECTOR', 'OPERATOR');

-- DropForeignKey
ALTER TABLE "BeneficialOwner" DROP CONSTRAINT "BeneficialOwner_kycId_fkey";

-- AlterTable
ALTER TABLE "OrganizationDocument" DROP COLUMN "fileUrl",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "BeneficialOwner";

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "kycId" TEXT NOT NULL,
    "role" "KycRole" NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_kycId_fkey" FOREIGN KEY ("kycId") REFERENCES "OrganizationKyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
