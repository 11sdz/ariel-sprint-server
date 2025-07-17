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
        const getEvent = await prisma.communityEvent.findUnique({
            where,
            include: {
                groups: {
                    select: {
                        community_name: true,
                    },
                },
                participants: {
                    select: {
                        full_name: true,
                        email: true,
                        phone: true,
                        // add other fields you want
                    },
                },
            },
        });
        return getEvent;
    } catch (error) {
        console.error("Error in getEventByIdController:", error);
        throw error;
    }
};

module.exports = {
    createEventController,
    getEventsController,
    getEventByIdController,
};
