const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function createCommunityMember(data) {
  return prisma.communityMember.create({ data });
}

async function getAllCommunityMembers() {
  return prisma.communityMember.findMany({ include: { jobHistory: true } });
}

async function getCommunityMemberById(id) {
  return prisma.communityMember.findUnique({
    where: { id: Number(id) },
    include: { jobHistory: true },
  });
}

// Add more service functions as needed (update, delete, etc.)

module.exports = {
  createCommunityMember,
  getAllCommunityMembers,
  getCommunityMemberById,
};
