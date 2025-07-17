const express = require("express");
const {getMemberById ,createMember,createMemberFromLinkedIn, getAllMembers , updateMember, getSuggestedGroups } = require("../services/memberService")


const router = express.Router();

router.post('/members', createMember);
router.post('/memberscv', createMemberFromLinkedIn);

router.get('/members', getAllMembers);
router.get('/members/:id', getMemberById);
router.patch('/members/:id', updateMember);
router.get("/members/:memberId/suggestedGroups", getSuggestedGroups);


module.exports = router;
