/*
  Warnings:

  - You are about to drop the column `productImage` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `usageDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_orderId_fkey`;

-- DropIndex
DROP INDEX `Vendor_name_key` ON `Vendor`;

-- AlterTable
ALTER TABLE `Album` DROP COLUMN `productImage`,
    ADD COLUMN `albumImage` TEXT NULL;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `phone`,
    DROP COLUMN `usageDate`,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `orderStatus` VARCHAR(191) NULL DEFAULT 'Pending',
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `productImage` TEXT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Vendor` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Review`;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `reviewRating` INTEGER NULL,
    `reviewComment` VARCHAR(191) NULL,
    `reviewDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Vendor_email_key` ON `Vendor`(`email`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
