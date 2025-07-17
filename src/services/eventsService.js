const {
    getEventsController,
    createEventController,
    getEventByIdController,
    updateParticipantByIdController,
} = require("../controllers/eventsController");

const getAllEvents = async (req, res) => {
    try {
        const events = await getEventsController();
        res.status(201).json(events);
    } catch (error) {
        console.error("failed to get groups", error);
        res.status(500).json({ error: "failed to get groups" });
    }
};

const createEvent = async (req, res) => {
    try {
        const event = await createEventController(req.body);
        res.status(201).json(event);
    } catch (error) {
        console.error("Failed to create event:", error);
        res.status(500).json({ error: "Failed to create event " });
    }
};

const getEventById = async (req, res) => {
    try {
        const eventId = Number(req.params.id);
        console.log(eventId);
        const getEvent = await getEventByIdController({
            where: { id: eventId },
        });
        res.json(getEvent);
    } catch (error) {
        console.error("Error getting event :", error);
        res.status(500).json({ error: "Failed to get event" });
    }
};

const updateParticipant = async (req, res) => {
    try {
        const eventId = Number(req.params.eventId);
        const id = Number(req.params.participantId);
        const updateData = req.body;

        console.log(req.body,req.params,"req boddy")

        const updatedParticipant = await updateParticipantByIdController({
            where: { id: id, eventId }, // ✅ uses `id`, not `participantId`
            data: updateData,
        });

        res.json(updatedParticipant);
    } catch (error) {
        console.error("Error updating participant:", error);
        res.status(500).json({ error: "Failed to update participant" });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateParticipant,
};
