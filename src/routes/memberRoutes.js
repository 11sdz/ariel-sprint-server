const express = require("express");
const {getMemberById ,createMember, getAllMembers , updateMember, getSuggestedGroups } = require("../services/memberService")


const router = express.Router();

router.post('/members', createMember);
router.get('/members', getAllMembers);
router.get('/members/:id', getMemberById);
router.patch('/members/:id', updateMember);
router.get("/members/:memberId/suggestedGroups", getSuggestedGroups);


module.exports = router;
