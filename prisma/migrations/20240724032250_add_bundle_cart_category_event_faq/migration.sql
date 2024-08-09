/*
  Warnings:

  - You are about to drop the column `orderId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `reviewComment` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `reviewDate` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `reviewRating` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Visit` table. All the data in the column will be lost.
  - Added the required column `cartId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cartId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `orderStatus` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentUrl` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Visit` DROP FOREIGN KEY `Visit_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Visit` DROP FOREIGN KEY `Visit_userId_fkey`;

-- AlterTable
ALTER TABLE `Item` DROP COLUMN `orderId`,
    DROP COLUMN `reviewComment`,
    DROP COLUMN `reviewDate`,
    DROP COLUMN `reviewRating`,
    ADD COLUMN `cartId` INTEGER NOT NULL,
    ADD COLUMN `eventId` INTEGER NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    MODIFY `productId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `userId`,
    ADD COLUMN `cartId` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    MODIFY `orderStatus` VARCHAR(191) NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `category`,
    ADD COLUMN `capacity` INTEGER NULL,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rate` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Vendor` DROP COLUMN `picture`,
    ADD COLUMN `documentUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `instagram` VARCHAR(191) NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `joinDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `socialMedia` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Visit` DROP COLUMN `productId`,
    DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `Bundle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `cartDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cartStatus` VARCHAR(191) NOT NULL DEFAULT 'Active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rate` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `capacity` INTEGER NULL,
    `description` TEXT NULL,
    `eventImage` TEXT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faq` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `reviewDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bundle` ADD CONSTRAINT `Bundle_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bundle` ADD CONSTRAINT `Bundle_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
