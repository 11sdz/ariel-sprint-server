const express = require("express");
const {getMemberByID ,createMember, getAllMembers , updateMember } = require("../services/memberService")


const router = express.Router();

router.post('/members', createMember);
router.get('/members', getAllMembers);
router.get('/members/:id', getMemberByID);
router.patch('/members/:id', updateMember);

module.exports = router;
