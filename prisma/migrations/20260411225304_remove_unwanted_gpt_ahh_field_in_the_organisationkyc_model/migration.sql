/*
  Warnings:

  - You are about to drop the column `country` on the `OrganizationKyc` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `OrganizationKyc` table. All the data in the column will be lost.
  - You are about to drop the column `registrationNo` on the `OrganizationKyc` table. All the data in the column will be lost.
  - You are about to drop the column `taxIdNumber` on the `OrganizationKyc` table. All the data in the column will be lost.
  - You are about to drop the column `taxResidence` on the `OrganizationKyc` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrganizationKyc" DROP COLUMN "country",
DROP COLUMN "entityType",
DROP COLUMN "registrationNo",
DROP COLUMN "taxIdNumber",
DROP COLUMN "taxResidence";
