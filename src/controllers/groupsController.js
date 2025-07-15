const prisma = require("../prismaClient")

const getGroupsController = async () =>{
    const groups = await prisma.communityGroup.findMany()

    return groups
}

module.exports =  {getGroupsController}