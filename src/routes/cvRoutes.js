const express = require("express");
const multer = require("multer");
const { parseCV } = require("../services/cvService");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/cvs', upload.single("cv"), parseCV);

module.exports = router;
