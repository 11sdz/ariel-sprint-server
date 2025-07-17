// services/gpt.js
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function sendToGpt(prompt) {

    try {
        const respons = await openai.chat.completions.create({
            model: 'gpt-4o', // אפשר גם gpt-4, gpt-3.5-turbo לעלות נמוכה
            messages: [
                { role: "user", content: prompt }
            ],
            max_tokens: 700,
            temperature: 0,
        });
        return respons;

    } catch (err) {
        return { error: err.message };
    }
}

module.exports = { sendToGpt };
