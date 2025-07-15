const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const groups = [
  { community_name: "Engineering", description: "Tech and engineering related" },
  { community_name: "Product Management", description: "Product owners and managers" },
  { community_name: "UX Research", description: "User experience researchers" },
  { community_name: "Marketing", description: "Marketing professionals" },
  { community_name: "Sales", description: "Sales teams and reps" },
  { community_name: "Public Relations", description: "PR and communications" },
  { community_name: "Business Development", description: "Growth and partnerships" },
  { community_name: "Finance", description: "Finance and accounting" },
  { community_name: "Human Resources", description: "HR and recruitment" },
  { community_name: "Legal", description: "Legal and compliance" },
  { community_name: "Administration", description: "Office and admin staff" },
  { community_name: "IT", description: "IT support and infrastructure" },
  { community_name: "Security", description: "Security and risk management" },
  { community_name: "QA / Testing", description: "Quality assurance and testing" },
  { community_name: "Operations", description: "Operations management" },
  { community_name: "Customer Success", description: "Customer support and success" },
  { community_name: "Support", description: "Technical support teams" },
  { community_name: "Training", description: "Training and development" },
  { community_name: "Logistics", description: "Logistics and supply chain" },
  { community_name: "Research & Development", description: "Innovation and R&D" }
];

async function seedGroups() {
  try {
    for (const group of groups) {
      const existing = await prisma.communityGroup.findFirst({
        where: { community_name: group.community_name }
      });

      if (!existing) {
        await prisma.communityGroup.create({ data: group });
        console.log(`✔️ Created group: ${group.community_name}`);
      } else {
        console.log(`ℹ️ Group already exists: ${group.community_name}`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding groups:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedGroups();
