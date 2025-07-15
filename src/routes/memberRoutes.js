const express = require("express");
const { createMember, getAllMembers , updateMember } = require("../services/memberService")


const router = express.Router();

router.post('/members', createMember);
router.get('/members', getAllMembers);
router.patch('/members/:id', updateMember)

module.exports = router;
