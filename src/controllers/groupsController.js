const prisma = require("../prismaClient");

const getGroupsController = async () => {
    const groups = await prisma.communityGroup.findMany();

    return groups;
};

const createGroupController = async (data) => {
    const { community_name,description} = data;
    const created_at= new Date()

    const newGroup = await prisma.communityGroup.create({
        data: {
            community_name,
            description,
            created_at,
        },
    });

    return newGroup;
};

module.exports = { createGroupController,getGroupsController };
