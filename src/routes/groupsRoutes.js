const express = require("express");
const {getAllGroups,createGroup} = require("../services/groupsService")

const router = express.Router()

router.get('/groups',getAllGroups)
router.post('/groups',createGroup)

module.exports = router;