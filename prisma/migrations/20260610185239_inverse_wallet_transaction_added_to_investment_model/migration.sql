/*
  Warnings:

  - The values [WALLET_INVESTMENT] on the enum `TransactionIntent` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `acronym` on the `Fund` table. All the data in the column will be lost.
  - Made the column `fundId` on table `Investment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionIntent_new" AS ENUM ('WALLET_FUNDING', 'DIRECT_INVESTMENT', 'WITHDRAWAL_REQUEST');
ALTER TABLE "WalletTransaction" ALTER COLUMN "intent" TYPE "TransactionIntent_new" USING ("intent"::text::"TransactionIntent_new");
ALTER TYPE "TransactionIntent" RENAME TO "TransactionIntent_old";
ALTER TYPE "TransactionIntent_new" RENAME TO "TransactionIntent";
DROP TYPE "public"."TransactionIntent_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_fundId_fkey";

-- DropIndex
DROP INDEX "WalletTransaction_investmentId_key";

-- AlterTable
ALTER TABLE "Fund" DROP COLUMN "acronym";

-- AlterTable
ALTER TABLE "Investment" ALTER COLUMN "fundId" SET NOT NULL;

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "walletAddress" TEXT;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
