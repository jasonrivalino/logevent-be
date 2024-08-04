/*
  Warnings:

  - You are about to drop the column `rate` on the `Event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Album` DROP FOREIGN KEY `Album_productId_fkey`;

-- AlterTable
ALTER TABLE `Album` ADD COLUMN `eventId` INTEGER NULL,
    MODIFY `productId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Event` DROP COLUMN `rate`;

-- AddForeignKey
ALTER TABLE `Album` ADD CONSTRAINT `Album_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Album` ADD CONSTRAINT `Album_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
