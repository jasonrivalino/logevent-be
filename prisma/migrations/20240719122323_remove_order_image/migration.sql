/*
  Warnings:

  - You are about to drop the column `orderImage` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_productId_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `orderImage`,
    DROP COLUMN `productId`;
