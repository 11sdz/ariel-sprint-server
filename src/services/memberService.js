const { createMemberController, getMembersController } = require('../controllers/memberController');

const createMember = async (req, res) => {
    try {
        const member = await createMemberController(req.body);
        res.status(201).json(member);
    } catch (error) {
        console.error('Failed to create member:', error);
        res.status(500).json({ error: 'Failed to create member' });
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

module.exports = { createMember, getAllMembers };
