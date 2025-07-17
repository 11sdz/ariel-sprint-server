// src/cv/process.js

const { extractFile } = require('./extractFile');
const { extractJsonFromGptOutput } = require('./extractJson');
const { sendToGpt } = require('../openai/gpt');
const fs = require('fs');

async function parseCV(cvFile) {
    const cvText = await extractFile(cvFile);

    const promptTemplate = fs.readFileSync('./src/cv/prompt.txt', 'utf-8');
    const prompt = promptTemplate.replace('<<CV>>', cvText);

    let answer = await sendToGpt(prompt);
    
    let gptText = answer.choices[0].message.content;
    let result = await extractJsonFromGptOutput(gptText);


    // result = JSON.parse(gptText);
    return result;
}

module.exports = { parseCV };
