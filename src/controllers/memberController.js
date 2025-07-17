const prisma = require("../prismaClient");

const createMemberController = async (data) => {
    const { full_name, email, profile_img } = data;

    const newMember = await prisma.communityMember.create({
        data: {
            full_name,
            email,
            profile_img,
        },
    });

    return newMember;
};


const createMemberLinkedinController = async (data) => {
    const {
      full_name,
      email,
      profile_img,
      phone,
      city,
      wants_updates,
      additional_info,
      linkedin_url,
      facebook_url,
      community_value,
      countryId,
      job_history,
      groups,
    } = data;
  
    const existingMember = await prisma.communityMember.findUnique({
        where: { email },
      });
    
      if (existingMember) {
        return existingMember;
      }
    

    const newMember = await prisma.communityMember.create({
      data: {
        full_name,
        email,
        profile_img,
        phone,
        city,
        wants_updates,
        additional_info,
        linkedin_url,
        facebook_url,
        community_value,
        countryId,
        job_history: {
          create: job_history,  // מערך של אובייקטים
        },
        groups: {
          connect: groups,      // מערך של אובייקטים {id: number}
        },
      },
    });
  
    return newMember;
  };
  

const getMembersController = async () => {
    const members = await prisma.communityMember.findMany({
        include: {
            job_history: {
                select: {
                    role: true,
                    company_name: true,
                    start_date: true,
                    end_date: true,
                },
            },
            groups: {
                select: {
                    community_name: true,
                },
            },
        },
    });
    return members;
};

const updateMemberController = async ({ where, data }) => {
    try {
        const updatedMember = await prisma.communityMember.update({
            where,
            data,
        });
        return updatedMember;
    } catch (error) {
        console.error("Error in updateMemberController:", error);
        throw error;
    }
};

const updateMemberGroupsController = async ({ memberId, groupIds }) => {
    try {

        const validGroupIds = groupIds.filter(id => id !== null && id !== undefined);

        const updatedMember = await prisma.communityMember.update({
            where: { id: memberId },
            data: {
                groups: {
                    connect: validGroupIds.map((id) => ({ id })), // removes existing and sets new ones
                },
            },
            include: {
                groups: true, // include groups in response if needed
            },
        });

        return updatedMember;
    } catch (error) {
        console.error('Error in updateMemberGroupsController:', error);
        throw error;
    }
};


const getMemberByIdController = async ({ where }) => {    
    try {
        const getMember = await prisma.communityMember.findUnique({
            where, 
            include: {
                job_history: {
                    select: {
                        role: true,
                        company_name: true,
                        start_date: true,
                        end_date: true,
                    },
                },
                groups: {
                    select: {
                        community_name: true,
                    },
                },
            },
        });
        return getMember;
    } catch (error) {
        console.error("Error in getMemberByIdController:", error);
        throw error;
    }
};

module.exports = {
    getMemberByIdController,
    createMemberController,
    getMembersController,
    updateMemberController,
    createMemberLinkedinController,
    updateMemberGroupsController
};
