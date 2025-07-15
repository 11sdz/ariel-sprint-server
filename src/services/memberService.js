const { createMemberController } = require("../controllers/memberController");


 const createMember = async (req, res) => {
    try {
        const member = await createMemberController(req.body);
        res.status(201).json(member);
    } catch (error) {
        console.error('Failed to create member:', error);
        res.status(500).json({error: 'Failed to create member'});
    }
}

module.exports = {createMember}