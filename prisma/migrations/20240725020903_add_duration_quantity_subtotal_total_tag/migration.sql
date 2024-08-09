/*
  Warnings:

  - You are about to drop the column `type` on the `Item` table. All the data in the column will be lost.
  - Added the required column `subtotal` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Item` DROP COLUMN `type`,
    ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `quantity` INTEGER NULL,
    ADD COLUMN `subtotal` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `total` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `Review` ADD COLUMN `tag` VARCHAR(191) NULL;
