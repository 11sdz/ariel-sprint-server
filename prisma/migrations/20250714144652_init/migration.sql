-- CreateTable
CREATE TABLE `CommunityMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CommunityMember_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `communityMemberId` INTEGER NOT NULL,
    `jobTitle` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JobHistory` ADD CONSTRAINT `JobHistory_communityMemberId_fkey` FOREIGN KEY (`communityMemberId`) REFERENCES `CommunityMember`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
