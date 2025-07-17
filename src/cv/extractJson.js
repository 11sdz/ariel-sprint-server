// src/cv/extractJson.js

async function extractJsonFromGptOutput(answer) {
    // אם answer הוא אובייקט (כלומר, חזרת על אותה טעות), תחלץ ממנו את ה-content
    if (answer && answer.choices && answer.choices[0] && answer.choices[0].message && answer.choices[0].message.content) {
        answer = answer.choices[0].message.content;
    }

    if (!answer) {
        throw new Error("No content found in GPT output");
    }

    // 2. הסר סימוני קוד אם קיימים
    if (answer.startsWith("```")) {
        answer = answer.replace(/```json|```/g, "").trim();
    }

    // 3. חלץ רק את ה־JSON
    const firstBrace = answer.indexOf("{");
    const lastBrace = answer.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) {
        answer = answer.substring(firstBrace, lastBrace + 1);
    }
    const jsonString = answer.substring(firstBrace, lastBrace + 1);

    // 4. פרסר ל־JS Object
    try {
        return JSON.parse(jsonString);
    } catch (err) {
        throw new Error("Invalid JSON returned by GPT: " + err.message + "\n" + jsonString);
    }
}

module.exports = { extractJsonFromGptOutput };
