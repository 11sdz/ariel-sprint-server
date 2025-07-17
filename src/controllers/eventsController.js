const prisma = require("../prismaClient");

// Get all events with related groups and participants (optional include)
const getEventsController = async () => {
    const events = await prisma.communityEvent.findMany({
        include: {
            groups: true, // Include related groups
            participants: true, // Include participants
        },
    });
    return events;
};

// Create a new event
const createEventController = async (data) => {
    const {
        event_name,
        start_date,
        end_date,
        location,
        price,
        type,
        descriptions,
        event_img,
        groupIds = [], // array of group IDs to connect
        participantIds = [], // array of participant IDs to connect
    } = data;

    const newEvent = await prisma.communityEvent.create({
        data: {
            event_name,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            location,
            price,
            type,
            descriptions,
            event_img,
            groups: {
                connect: groupIds.map((id) => ({ id })),
            },
            participants: {
                connect: participantIds.map((id) => ({ id })),
            },
        },
    });

    return newEvent;
};

const getEventByIdController = async ({ where }) => {
    try {
        const event = await prisma.communityEvent.findUnique({
            where,
        });

        if (!event) return null;

        const groups = await prisma.communityEventGroup.findMany({
            where: { eventId: where.id },
            select: {
                group: {
                    select: {
                        community_name: true,
                    },
                },
            },
        });

        const participants = await prisma.communityEventParticipant.findMany({
            where: { eventId: where.id },
            select: {
                id: true,
                eventId: true,
                memberId: true,
                status: true,
                member: {
                    select: {
                        full_name: true,
                        email: true,
                        phone: true,
                        profile_img: true,
                    },
                },
            },
        });

        return {
            ...event,
            groups: groups.map((g) => g.group),
            participants,
        };
    } catch (error) {
        console.error("Error in getEventByIdController:", error);
        throw error;
    }
};

const updateParticipantByIdController = async ({ where, data }) => {
    try {
        const updateEvent = await prisma.communityEventParticipant.update({
            where,
            data,
        });
        return updateEvent;
    } catch (error) {
        console.error("Error in updateMemberController:", error);
        throw error;
    }
};

module.exports = {
    createEventController,
    getEventsController,
    getEventByIdController,
    updateParticipantByIdController
};
