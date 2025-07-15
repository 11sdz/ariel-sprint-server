const prisma = require("../prismaClient")

const createMemberController = async (data) => {
    const {
        full_name,
        email,
        profile_img
    } = data;    
    
    const newMember = await prisma.communityMember.create({
        data: {
            full_name,
            email,
            profile_img
        }
    })

    return newMember
}

module.exports = {createMemberController}