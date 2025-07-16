const OpenAI = require('openai');
const { getMemberByIdController } = require('../controllers/memberController');
const { getGroupsController } = require('../controllers/groupsController');

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

function filterGroups(user, groups) {
    return groups.filter((group) => {
        const groupName = group.community_name?.toLowerCase() || '';
        const groupDescription = group.description?.toLowerCase() || '';
        const additionalInfo = user.additional_info?.toLowerCase() || '';

        const experienceMatch = user.job_history.some((job) => {
            const role = job.role?.toLowerCase() || '';
            return groupName.includes(role) || groupDescription.includes(role);
        });

        const companyMatch = user.job_history.some((job) => {
            const company = job.company_name?.toLowerCase() || '';
            return groupName.includes(company) || groupDescription.includes(company);
        });

        const additionalInfoMatch = groupName.includes(additionalInfo) || groupDescription.includes(additionalInfo);

        return experienceMatch || companyMatch || additionalInfoMatch;
    });
}

async function suggestGroupsForUser(userId) {
    const user = await getMemberByIdController({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const groups = await getGroupsController();

    const relevantGroups = filterGroups(user, groups);

    const prompt = `
   You are an assistant that suggests relevant community groups for users based on their profile and available groups.

Given the user profile and the list of relevant existing groups below, please provide a JSON object with two keys:

1. "existingGroups": an array of objects, each representing a group from the existing list that suits the user.
2. "newGroups": an array of objects, each representing a new group that you recommend creating if no perfect match exists.

Each object should have these properties:
- "groupName": the name of the group (string)
- "reason": a brief explanation why this group is suitable or recommended (string)

User profile:
- Full name: ${user.full_name}
- Location: ${user.city || 'N/A'}
- Job history:
${user.job_history.map((j) => `  • ${j.role} at ${j.company_name}`).join('\n')}
- Additional info: ${user.additional_info || 'N/A'}

Relevant existing groups:
${relevantGroups.map((g, i) => `${i + 1}. ${g.community_name} — ${g.description || 'No description'}`).join('\n')}

Return ONLY a valid JSON object in the following format:

{
  "existingGroups": [
    {
      "groupName": "Group Name",
      "reason": "Reason why this group matches the user"
    }
  ],
  "newGroups": [
    {
      "groupName": "New Group Name",
      "reason": "Reason why this new group is recommended"
    }
  ]
}
    `;

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are an assistant that suggests relevant community groups for users.',
            },
            { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 400,
    });
    console.log(response.choices[0].message.content);

    return response.choices[0].message.content;
}

module.exports = {
    suggestGroupsForUser,
};
