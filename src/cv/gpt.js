// services/gpt.js
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const fs = require('fs');
const promptTemplate = fs.readFileSync('./src/cv/prompt.txt', 'utf-8');

async function sendToGpt(cvText) {
    const prompt = promptTemplate.replace('<<CV>>', cvText,);

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', // אפשר גם gpt-4, gpt-3.5-turbo לעלות נמוכה
            messages: [
                { role: "user", content: prompt }
            ],
            max_tokens: 700,
            temperature: 0,
        });

        // תמיד תחפש JSON
        let answer = completion.choices[0].message.content.trim();

        // Remove code block markers (```json ... ```)
        if (answer.startsWith("```")) {
            answer = answer.replace(/```json|```/g, "").trim();
        }

        // Extract JSON from within possible surrounding text
        const firstBrace = answer.indexOf("{");
        const lastBrace = answer.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
            answer = answer.substring(firstBrace, lastBrace + 1);
        }
        return JSON.parse(answer);

    } catch (err) {
        return { error: err.message };
    }
}

module.exports = { sendToGpt };
