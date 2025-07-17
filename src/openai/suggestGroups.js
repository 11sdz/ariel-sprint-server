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
    console.log('All groups:', groups);

    const currentGroupIds = user.groups?.map((g) => g.id) || [];
    const nonMemberGroups = groups.filter((g) => !currentGroupIds.includes(g.id));
    console.log('Non-member groups:', nonMemberGroups);

    let relevantGroups = filterGroups(user, nonMemberGroups);
    console.log('Relevant groups after filter:', relevantGroups);

    // אם הפילטר מחזיר ריק, נשתמש בכל קבוצות שאינן שייכות למשתמש
    if (relevantGroups.length === 0) {
        console.log('No relevant groups found by filterGroups, falling back to nonMemberGroups');
        relevantGroups = nonMemberGroups;
    }

    // מפת ID => שם קבוצה (מהקבוצות הרלוונטיות)
    const groupsMap = new Map();
    relevantGroups.forEach(g => groupsMap.set(g.id, g.community_name));
    console.log('Groups map keys:', Array.from(groupsMap.keys()));

    const prompt = `
You are an assistant that suggests relevant community groups for users based on their profile.

Given the user profile below and the full list of available groups, choose which existing groups best fit the user.

⚠️ VERY IMPORTANT: For existing groups, return ONLY the group ID and a reason. DO NOT invent or guess the group name. The system will fill it in based on the ID.

Return ONLY a valid JSON object with two keys: "existingGroups" and "newGroups".

- "existingGroups": an array of groups, each with:
    - "id": the group's ID (number)
    - "reason": short explanation why this group fits the user

- "newGroups": an array of new recommended groups, each with:
    - "groupName": suggested group name (string)
    - "reason": why this group is recommended

User profile:
- Full name: ${user.full_name}
- Location: ${user.city || 'N/A'}
- Job history:
${user.job_history.map((j) => `  - ${j.role} at ${j.company_name}`).join('\n')}
- Additional info: ${user.additional_info || 'N/A'}

Available groups (ID and exact name):
${relevantGroups.map((g) => `- ID: ${g.id}, Name: ${g.community_name}`).join('\n')}

Return JSON only, no extra text.
`;

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are an assistant that suggests relevant community groups for users.' },
            { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 400,
    });

    let aiContent = response.choices[0].message.content;

    // אם הטקסט עטוף במרכאות - להסיר
    if (aiContent.startsWith('"') && aiContent.endsWith('"')) {
        aiContent = aiContent.slice(1, -1).replace(/\\"/g, '"');
    }

    let parsed;
    try {
        parsed = JSON.parse(aiContent);
    } catch (err) {
        console.error('❌ Failed to parse AI JSON:', aiContent);
        throw new Error('Failed to parse AI response JSON: ' + err.message);
    }

    parsed.existingGroups = parsed.existingGroups.map(g => ({
        id: g.id,
        groupName: groupsMap.get(g.id) || 'Unknown Group',
        reason: g.reason,
    }));

    console.log('✅ Final mapped existing groups:', parsed.existingGroups);

    return parsed;
}

module.exports = {
    suggestGroupsForUser,
};
