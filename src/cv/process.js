// src/cv/process.js

const { extractFile } = require('./extractFile');
const { sendToGpt } = require('./gpt');

async function parseCV(file) {
    const text = await extractFile(file);
    const result = await sendToGpt(text);
    return result;
}

module.exports = { parseCV };
