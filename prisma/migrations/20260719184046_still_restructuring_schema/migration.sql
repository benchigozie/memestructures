/*
  Warnings:

  - You are about to drop the column `fundId` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the `Fund` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,assetClassId]` on the table `Position` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetClassId` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_fundId_fkey";

-- DropIndex
DROP INDEX "Position_userId_fundId_key";

-- AlterTable
ALTER TABLE "Position" DROP COLUMN "fundId",
ADD COLUMN     "assetClassId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Fund";

-- CreateIndex
CREATE UNIQUE INDEX "Position_userId_assetClassId_key" ON "Position"("userId", "assetClassId");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_assetClassId_fkey" FOREIGN KEY ("assetClassId") REFERENCES "AssetClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
