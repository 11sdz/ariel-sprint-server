const {
    createMemberController,
    getMembersController,
    updateMemberController,
    getMemberByIdController
} = require("../controllers/memberController");

const createMember = async (req, res) => {
    try {
        const member = await createMemberController(req.body);
        res.status(201).json(member);
    } catch (error) {
        console.error("Failed to create member:", error);
        res.status(500).json({ error: "Failed to create member" });
    }
};

const getAllMembers = async (req, res) => {
    try {
        const members = await getMembersController();
        res.status(201).json(members);
    } catch (error) {
        console.error("Failed to get members", error);
        res.status(500).json({ error: "Failed to get members" });
    }
};

const updateMember = async (req, res) => {
    try {
        const memberId = Number({where: req.params.id});
        const updateData = req.body;
        const updatedMember  = await updateMemberController({
            where: { id: memberId },
            data: updateData,
        });
        res.json(updatedMember );
    } catch (error){
        console.error("Error updating member:", error);
        res.status(500).json({ error: "Failed to update member" });
    }
};

    const getMemberByID = async (req, res) => {
        try {
            const memberId = Number(req.params.id);
            console.log("IDDD",memberId)
            const getMember = await getMemberByIdController({
                where: {id: memberId}
            });
            res.json(getMember);
        } catch (error) {
            console.error("Error getting member:", error);
            res.status(500).json({ error: "Failed to get member" });
        }
    };

module.exports = { getMemberByID , createMember, getAllMembers, updateMember };
