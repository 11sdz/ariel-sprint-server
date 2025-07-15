const express = require("express");
const { createMember, getAllMembers } = require("../services/memberService")


const router = express.Router();

router.post('/members', createMember);
router.get('/members', getAllMembers);

module.exports = router;
