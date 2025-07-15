const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const countries = [
  { country_name: "Israel", code: "IL" },
  { country_name: "United States", code: "US" },
  { country_name: "United Kingdom", code: "GB" },
  { country_name: "Germany", code: "DE" },
  { country_name: "France", code: "FR" },
  { country_name: "Canada", code: "CA" },
  { country_name: "Australia", code: "AU" },
  { country_name: "India", code: "IN" },
  { country_name: "Brazil", code: "BR" },
  { country_name: "Japan", code: "JP" },
];

async function seedCountries() {
  for (const country of countries) {
    const exists = await prisma.country.findFirst({
      where: { country_name: country.country_name },
    });

    if (!exists) {
      await prisma.country.create({
        data: country,
      });
      console.log(`🌍 Created: ${country.country_name}`);
    } else {
      console.log(`✅ Already exists: ${country.country_name}`);
    }
  }

  await prisma.$disconnect();
}

seedCountries().catch((err) => {
  console.error("❌ Error seeding countries:", err);
  prisma.$disconnect();
  process.exit(1);
});
