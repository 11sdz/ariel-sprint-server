// services/extractFile.js
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

async function extractFile(input, fileName = "") {
  let buffer, mimetype, originalname, ext;

  // אם זה אובייקט קובץ (יש לו buffer), קח ממנו הכל
  if (input && typeof input === "object" && input.buffer) {
    buffer = input.buffer;
    mimetype = input.mimetype || "";
    originalname = input.originalname || "";
    ext = path.extname(originalname).toLowerCase();
  }
  // אם זה Buffer רגיל — נדרש לקבל גם fileName/extension כפרמטר נוסף!
  else if (Buffer.isBuffer(input)) {
    buffer = input;
    originalname = fileName;
    ext = path.extname(fileName).toLowerCase();
    mimetype = ext === ".pdf" ? "application/pdf"
             : ext === ".docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
             : "application/octet-stream";
  } else {
    throw new Error("extractFile: invalid input");
  }

  // ממשיך כמו קודם:
  if (mimetype === "application/pdf" || ext === ".pdf") {
    const result = await pdf(buffer);
    return result.text;
  }
  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === ".docx"
  ) {
    const result = await mammoth.extractRawText({ buffer: buffer });
    return result.value;
  }
  throw new Error("Unsupported file type.");
}

module.exports = { extractFile };
