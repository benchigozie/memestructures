/*
  Warnings:

  - A unique constraint covering the columns `[investmentId]` on the table `WalletTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "TransactionIntent" ADD VALUE 'WALLET_INVESTMENT';

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_investmentId_key" ON "WalletTransaction"("investmentId");
