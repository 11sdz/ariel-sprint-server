const express = require("express");
const {getAllEvents,createEvent,getEventById,updateParticipant} = require("../services/eventsService")

const router = express.Router()

router.get('/events',getAllEvents)
router.post('/events',createEvent)
router.get('/events/:id',getEventById)
router.patch('/events/:eventId/participants/:participantId',updateParticipant);

module.exports = router;