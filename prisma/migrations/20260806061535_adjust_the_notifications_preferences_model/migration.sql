/*
  Warnings:

  - You are about to drop the column `emailNotifications` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `inAppNotifications` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `newsletters` on the `NotificationPreference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationPreference" DROP COLUMN "emailNotifications",
DROP COLUMN "inAppNotifications",
DROP COLUMN "newsletters";
