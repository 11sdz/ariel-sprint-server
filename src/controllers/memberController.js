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

const getMembersController = async () => {
    const members = await prisma.communityMember.findMany({
        include: {
            job_history: {
              select: {
                role: true,
                company_name: true,
                start_date: true,
                end_date: true,
              }
            },
            groups: {
              select: {
                community_name: true
              }
            }
          }
    });
    return members;
  }
  

module.exports = {createMemberController, getMembersController}