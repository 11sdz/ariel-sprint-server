const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { members } = require("../members"); // ודא שזה הנתיב הנכון

async function seed() {

    for (const member of members) {
        const countryName = member.location.country;

        // מצא או צור מדינה
        let country = await prisma.country.findFirst({
            where: { country_name: countryName },
        });

        if (!country) {
            country = await prisma.country.create({
                data: { country_name: countryName },
            });
        }

        // צור את המשתמש
        const newMember = await prisma.communityMember.create({
            data: {
                full_name: member.fullName,
                email: member.email,
                phone: member.phone,
                city: member.location.city,
                countryId: country.id,
                linkedin_url: member.linkedinURL,
                facebook_url: member.facebookURL,
                additional_info: member.additionalInfo,
                wants_updates: member.wantsUpdates,
                profile_img: member.profile_img, // אפשר לשנות
            },
        });

        // היסטוריית עבודה (JobHistory)
        for (const job of member.jobs_history) {
            await prisma.jobHistory.create({
                data: {
                    role: job.role,
                    company_name: job.companyName,
                    start_date: new Date(job.startDate),
                    end_date:
                        job.endDate === "Present"
                            ? null
                            : new Date(job.endDate),
                    communityMemberId: newMember.id,
                },
            });
        }

        // קבוצות (CommunityGroup)
        for (const groupName of member.groups) {
            let group = await prisma.communityGroup.findFirst({
                where: { community_name: groupName },
            });

            if (!group) {
                group = await prisma.communityGroup.create({
                    data: { community_name: groupName },
                });
            }

            // חבר את המשתמש לקבוצה
            await prisma.communityMember.update({
                where: { id: newMember.id },
                data: {
                    groups: {
                        connect: { id: group.id },
                    },
                },
            });
        }

        console.log(`✔️ Added member: ${newMember.full_name}`);
    }

    await prisma.$disconnect();
}

seed().catch((e) => {
    console.error("❌ Error seeding members:", e);
    prisma.$disconnect();
    process.exit(1);
});
