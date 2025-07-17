const { parseCV: parseCVInner } = require("../cv/process");

async function parseCV(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const jsonResult = await parseCVInner(file);
    res.json(jsonResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { parseCV };
