/*
  Warnings:

  - You are about to drop the column `idBackUrl` on the `OrganizationMember` table. All the data in the column will be lost.
  - You are about to drop the column `idFrontUrl` on the `OrganizationMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrganizationMember" DROP COLUMN "idBackUrl",
DROP COLUMN "idFrontUrl",
ADD COLUMN     "idBackPath" TEXT,
ADD COLUMN     "idFrontPath" TEXT,
ADD COLUMN     "proofOfAddressPath" TEXT,
ADD COLUMN     "proofOfAddressType" TEXT;
