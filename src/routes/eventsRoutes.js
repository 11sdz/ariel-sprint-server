const express = require("express");
const {getAllEvents,createEvent} = require("../services/eventsService")

const router = express.Router()

router.get('/events',getAllEvents)
router.post('/events',createEvent)

module.exports = router;