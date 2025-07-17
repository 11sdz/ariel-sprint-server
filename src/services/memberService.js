const {
    createMemberController,
    getMembersController,
    updateMemberController,
    getMemberByIdController,
    createMemberLinkedinController,
    updateMemberGroupsController,
} = require('../controllers/memberController');
const { faker } = require('@faker-js/faker');
const { suggestGroupsForUser } = require('../openai/suggestGroups');

const createMember = async (req, res) => {
    try {
        const member = await createMemberController(req.body);
        res.status(201).json(member);
    } catch (error) {
        console.error('Failed to create member:', error);
        res.status(500).json({ error: 'Failed to create member' });
    }
};

const createMemberFromLinkedIn = async (data) => {
    try {
        const full_name = data.name;
        const email = data.email;
        const profile_img = data.picture;

        const jobHistoryData = [
            {
                role: faker.person.jobTitle(),
                company_name: faker.company.name(),
                start_date: faker.date.past(5),
                end_date: faker.date.past(1),
                descriptions: faker.lorem.lines(1),
            },
            {
                role: faker.person.jobTitle(),
                company_name: faker.company.name(),
                start_date: faker.date.past(1),
                end_date: null,
                descriptions: faker.lorem.lines(1),
            },
        ];

        const groupIds = [1, 2];
        const memberData = {
            full_name,
            email,
            profile_img,
            phone: faker.phone.number(),
            city: faker.location.city(),
            wants_updates: Math.random() < 0.5,
            additional_info: faker.lorem.paragraph(),
            linkedin_url: `https://linkedin.com/in/${faker.internet.username()}`,
            facebook_url: faker.internet.url(),
            community_value: faker.company.buzzPhrase(),
            countryId: 1,
            job_history: jobHistoryData, // ישיר, לא עטוף ב-create
            groups: groupIds.map((id) => ({ id })), // גם כן ישיר
        };

        const member = await createMemberLinkedinController(memberData);
        return member;
    } catch (error) {
        console.error('Failed to create member:', error);
        throw error;
    }
};

const getAllMembers = async (req, res) => {
    try {
        const members = await getMembersController();
        res.status(201).json(members);
    } catch (error) {
        console.error('Failed to get members', error);
        res.status(500).json({ error: 'Failed to get members' });
    }
};

const updateMember = async (req, res) => {
    try {
        const memberId = Number(req.params.id);

        const updateData = req.body;
        const updatedMember = await updateMemberController({
            where: { id: memberId },
            data: updateData,
        });
        res.json(updatedMember);
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ error: 'Failed to update member' });
    }
};

const updateMemberGroups = async (req, res) => {
    try {
        const memberId = Number(req.params.id);
        const { groupIds } = req.body; // expecting: { groupIds: [1, 2, 3] }

        const updatedMember = await updateMemberGroupsController({
            memberId,
            groupIds,
        });

        res.json(updatedMember);
    } catch (error) {
        console.error('Error updating member groups:', error);
        res.status(500).json({ error: 'Failed to update member groups' });
    }
};

const getMemberById = async (req, res) => {
    try {
        const memberId = Number(req.params.id);
        const getMember = await getMemberByIdController({
            where: { id: memberId },
        });
        res.json(getMember);
    } catch (error) {
        console.error('Error getting member:', error);
        res.status(500).json({ error: 'Failed to get member' });
    }
};

const getSuggestedGroups = async (req, res) => {
    try {
        const userId = Number(req.params.memberId);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const suggestions = await suggestGroupsForUser(userId);

        res.json({ suggestions });
    } catch (error) {
        console.error('Error getting suggested groups:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

module.exports = {
    getMemberById,
    createMember,
    getAllMembers,
    updateMember,
    createMemberFromLinkedIn,
    getSuggestedGroups,
    updateMemberGroups,
};
