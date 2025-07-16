// prisma/seedEvents.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedEvents() {
  const allGroups = await prisma.communityGroup.findMany();
  const allMembers = await prisma.communityMember.findMany();

  if (allGroups.length === 0 || allMembers.length === 0) {
    console.error('❌ Seed groups and members first before seeding events.');
    return;
  }

  const eventTypes = ['Workshop', 'Meetup', 'Hackathon', 'Seminar', 'Panel Talk'];
  const locations = ['Tel Aviv Hub', 'Haifa Tech Center', 'Jerusalem Labs', 'Online', 'Beer Sheva Campus'];
  const event_img = ['One-time', 'Monthly', 'Weekly', 'Bi-weekly'];
  const descriptions = [
    'Frontend development workshop with live coding.',
    'Networking session for tech founders.',
    'Hands-on React Native hackathon.',
    'Open Q&A panel with industry experts.',
    'Career development and CV review clinic.',
    'UX prototyping sprint for early-stage ideas.',
    'Intro to AI tools for developers.',
    'Cross-team collaboration case studies.',
    'Mental health and burnout session for engineers.',
    'Tech for Good: Social impact hackathon.'
  ];

  function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  for (let i = 0; i < 10; i++) {
    const randomGroups = allGroups
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1); // 1–2 groups

    const randomMembers = allMembers
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 3); // 3–5 members

    const start = new Date();
    start.setDate(start.getDate() + i * 7); // event spaced a week apart
    const end = new Date(start);
    end.setHours(end.getHours() + 3); // 3-hour event

    await prisma.communityEvent.create({
      data: {
        start_date: start,
        end_date: end,
        location: getRandom(locations),
        price: parseFloat((Math.random() * 50).toFixed(2)),
        type: getRandom(eventTypes),
        descriptions: getRandom(descriptions),
        event_img: getRandom(event_img),
        groups: { connect: randomGroups.map(g => ({ id: g.id })) },
        participants: { connect: randomMembers.map(m => ({ id: m.id })) },
      }
    });

    console.log(`📅 Created event #${i + 1}`);
  }
}

seedEvents()
  .then(() => {
    console.log('✅ Events seeded successfully');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Error seeding events:', e);
    prisma.$disconnect();
    process.exit(1);
  });
