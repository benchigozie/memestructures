/*
  Warnings:

  - You are about to drop the column `fundId` on the `Investment` table. All the data in the column will be lost.
  - Added the required column `assetClassId` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_fundId_fkey";

-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "fundId",
ADD COLUMN     "assetClassId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_assetClassId_fkey" FOREIGN KEY ("assetClassId") REFERENCES "AssetClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
