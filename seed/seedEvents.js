const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function seedEvents() {
    const allGroups = await prisma.communityGroup.findMany();
    const allMembers = await prisma.communityMember.findMany();

    if (allGroups.length === 0 || allMembers.length === 0) {
        console.error(
            "❌ Seed groups and members first before seeding events."
        );
        return;
    }

    const eventTypes = ["Workshop", "Seminar", "Hackathon", "Meetup"];
    const locations = ["Tel Aviv Hub", "Jerusalem Center", "Haifa Lounge"];
    const descriptions = [
        "Frontend development workshop with live coding.",
        "Networking meetup for JavaScript enthusiasts.",
        "Hackathon focused on building community tools.",
        "Hands-on seminar about TypeScript and React Native.",
    ];
    const event_img = [
        "https://i.imgur.com/bueCEF8.png",
        "https://i.imgur.com/Ab94jXb.png",
        "https://i.imgur.com/VoEbc7P.png",
        "https://i.imgur.com/JVrU31v.png",
    ];
    const statuses = ["Coming", "Maybe", "Not-interested", null, null, null];

    for (let i = 0; i < 10; i++) {
        const eventType = getRandom(eventTypes);
        const location = getRandom(locations);
        const start = new Date();
        const end = new Date(
            start.getTime() +
                Math.floor(Math.random() * 3 + 1) * 24 * 60 * 60 * 1000
        );
        const randomGroups = allGroups
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
        const randomMembers = allMembers
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        const eventName = `${eventType} at ${location} #${Math.floor(
            Math.random() * 1000
        )}`;

        const event = await prisma.communityEvent.create({
            data: {
                start_date: start,
                end_date: end,
                location,
                price: parseFloat((Math.random() * 50).toFixed(2)),
                type: eventType,
                descriptions: getRandom(descriptions),
                event_img: getRandom(event_img),
                event_name: eventName,
            },
        });

        // Create join table entries manually
        await Promise.all(
            randomGroups.map((group) =>
                prisma.communityEventGroup.create({
                    data: {
                        eventId: event.id,
                        groupId: group.id,
                    },
                })
            )
        );

        await Promise.all(
            randomMembers.map((member) =>
                prisma.communityEventParticipant.create({
                    data: {
                        eventId: event.id,
                        memberId: member.id,
                        status: getRandom(statuses),
                    },
                })
            )
        );

        console.log(`✅ Created event: ${eventName}`);
    }

    console.log("🎉 Seeding complete!");
}

seedEvents()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
