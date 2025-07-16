/*
  Warnings:

  - You are about to drop the `communityevent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `communityevent`;

-- CreateTable
CREATE TABLE `CommunityEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_name` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `price` DOUBLE NULL,
    `type` VARCHAR(191) NOT NULL,
    `descriptions` VARCHAR(191) NULL,
    `event_img` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_EventParticipants` ADD CONSTRAINT `_EventParticipants_A_fkey` FOREIGN KEY (`A`) REFERENCES `CommunityEvent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupEvents` ADD CONSTRAINT `_GroupEvents_A_fkey` FOREIGN KEY (`A`) REFERENCES `CommunityEvent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
