/*
  Warnings:

  - Added the required column `type` to the `CommunityEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `communityevent` ADD COLUMN `event_img` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
