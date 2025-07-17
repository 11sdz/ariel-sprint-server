const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { members } = require('../members'); // נתיב למערך המשתמשים

// היסטוריה נוספת רנדומלית למקרה שיש רק אחת ביוזר
const extraJobExample = {
  role: 'Consultant',
  companyName: 'Global Solutions',
  startDate: '2015-01-01',
  endDate: '2017-12-31',
};

async function seedJobHistories() {
  for (const member of members) {
    const user = await prisma.communityMember.findUnique({
      where: { email: member.email },
    });

    if (!user) {
      console.log(`⚠️ User not found, skipping: ${member.email}`);
      continue;
    }

    // מחיקת היסטוריות ישנות אם יש (לא חובה, רק אם רוצים ניקיון)
    await prisma.jobHistory.deleteMany({
      where: { communityMemberId: user.id },
    });

    let jobsToInsert = [];

    if (member.jobs_history.length === 1) {
      // אם יש רק היסטוריה אחת, נוסיף את ה-extraJobExample
      jobsToInsert = [...member.jobs_history, extraJobExample];
    } else if (member.jobs_history.length > 1) {
      // אם יש יותר מ-1 היסטוריה, ניקח רק 2 ראשונות
      jobsToInsert = member.jobs_history.slice(0, 2);
    } else {
      // אם אין בכלל היסטוריה, נכניס שתי דוגמאות
      jobsToInsert = [
        {
          role: 'Developer',
          companyName: 'Default Co',
          startDate: '2020-01-01',
          endDate: null,
        },
        extraJobExample,
      ];
    }

    // וודא שאחת מההיסטוריות היא נוכחית (endDate === null)
    let hasCurrent = jobsToInsert.some(job => job.endDate === 'Present' || job.endDate === null);
    if (!hasCurrent) {
      // אם אין, נעשה את הראשונה נוכחית
      jobsToInsert[0].endDate = null;
    }

    // צור את ההיסטוריות בפועל
    for (const job of jobsToInsert) {
      await prisma.jobHistory.create({
        data: {
          communityMemberId: user.id,
          role: job.role,
          company_name: job.companyName,
          start_date: new Date(job.startDate),
          end_date: job.endDate === 'Present' || job.endDate === null ? null : new Date(job.endDate),
        },
      });
    }

    console.log(`✔️ Created 2 job histories for: ${user.full_name}`);
  }

  await prisma.$disconnect();
}

seedJobHistories().catch((e) => {
  console.error('❌ Error seeding job histories:', e);
  prisma.$disconnect();
  process.exit(1);
});



// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function addTwoJobHistoriesToUser(userEmail, oldJob, currentJob) {
//   // 1. מצא את היוזר לפי email
//   const user = await prisma.communityMember.findUnique({
//     where: { email: userEmail },
//   });

//   if (!user) {
//     console.log('User not found');
//     return null;
//   }

//   // 2. הוסף את ההיסטוריה הישנה
//   const oldJobHistory = await prisma.jobHistory.create({
//     data: {
//       role: oldJob.role,
//       company_name: oldJob.companyName,
//       start_date: new Date(oldJob.startDate),
//       end_date: new Date(oldJob.endDate),
//       communityMemberId: user.id,
//     },
//   });

//   // 3. הוסף את ההיסטוריה הנוכחית (עם end_date = null)
//   const currentJobHistory = await prisma.jobHistory.create({
//     data: {
//       role: currentJob.role,
//       company_name: currentJob.companyName,
//       start_date: new Date(currentJob.startDate),
//       end_date: null,
//       communityMemberId: user.id,
//     },
//   });

//   return { oldJobHistory, currentJobHistory };
// }

// // שימוש לדוגמה:
// addTwoJobHistoriesToUser(
//   'shaked@example.com',
//   {
//     role: 'Junior Developer',
//     companyName: 'CodeBase',
//     startDate: '2018-01-01',
//     endDate: '2020-05-31',
//   },
//   {
//     role: 'Frontend Developer',
//     companyName: 'Techly',
//     startDate: '2020-06-01',
//   }
// )
//   .then((jobs) => {
//     console.log('Added job histories:', jobs);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
