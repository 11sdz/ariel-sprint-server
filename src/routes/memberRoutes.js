const express = require("express");
const { createMember } = require("../services/memberService")


const router = express.Router();

router.post('/members', createMember);

module.exports = router;
