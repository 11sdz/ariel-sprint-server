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

const getMemberByIdController = async ({ where }) => {
    console.log("wheererere", where);
    
    try {
        const getMember = await prisma.communityMember.findUnique({
            where, // pass inside the options object
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
};
