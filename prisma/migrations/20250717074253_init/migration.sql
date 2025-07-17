/*
  Warnings:

  - You are about to drop the `eventparticipant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `eventparticipant` DROP FOREIGN KEY `EventParticipant_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `eventparticipant` DROP FOREIGN KEY `EventParticipant_memberId_fkey`;

-- DropTable
DROP TABLE `eventparticipant`;

-- CreateTable
CREATE TABLE `CommunityEventParticipant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommunityEventGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CommunityEventParticipant` ADD CONSTRAINT `CommunityEventParticipant_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `CommunityEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommunityEventParticipant` ADD CONSTRAINT `CommunityEventParticipant_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `CommunityMember`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommunityEventGroup` ADD CONSTRAINT `CommunityEventGroup_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `CommunityEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommunityEventGroup` ADD CONSTRAINT `CommunityEventGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `CommunityGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
