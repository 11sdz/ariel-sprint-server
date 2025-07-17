// services/cvService.js
const { parseCV: parseCVInner } = require("../cv/process");

async function parseCV(req, res) {
  try {
    const cvFile = req.file;
    if (!cvFile) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const jsonResult = await parseCVInner(cvFile);
    res.json(jsonResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { parseCV };
