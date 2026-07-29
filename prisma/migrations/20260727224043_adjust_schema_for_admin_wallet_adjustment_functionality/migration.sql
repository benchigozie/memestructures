-- AlterEnum
ALTER TYPE "TransactionIntent" ADD VALUE 'ADMIN_ADJUSTMENT';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WalletTransactionType" ADD VALUE 'ADMIN_CREDIT';
ALTER TYPE "WalletTransactionType" ADD VALUE 'ADMIN_DEBIT';

-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isManaged" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
