const communityMemberService = require("../services/communityMemberService");

async function createCommunityMember(req, res) {
  try {
    const data = req.body;
    const newMember = await communityMemberService.createCommunityMember(data);
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getAllCommunityMembers(req, res) {
  try {
    const members = await communityMemberService.getAllCommunityMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCommunityMemberById(req, res) {
  try {
    const id = req.params.id;
    const member = await communityMemberService.getCommunityMemberById(id);
    if (!member) return res.status(404).json({ error: "Not found" });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createCommunityMember,
  getAllCommunityMembers,
  getCommunityMemberById,
};
