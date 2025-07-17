const express = require("express");
const {getAllEvents,createEvent,getEventById} = require("../services/eventsService")

const router = express.Router()

router.get('/events',getAllEvents)
router.post('/events',createEvent)
router.get('/events/:id',getEventById)

module.exports = router;