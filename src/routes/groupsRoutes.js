const express = require("express");
const {getAllGroups} = require("../services/groupsService")

const router = express.Router()

router.get('/groups',getAllGroups)

module.exports = router;